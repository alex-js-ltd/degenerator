import { Degenerator } from '../target/types/degenerator'
import { Program, BN, web3 } from '@coral-xyz/anchor'

import {
	type Signer,
	type TransactionInstruction,
	Connection,
	Keypair,
	PublicKey,
	TransactionMessage,
	VersionedTransaction,
} from '@solana/web3.js'

import {
	TOKEN_2022_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token'

async function airDrop({
	payer,
	connection,
}: {
	payer: Keypair
	connection: Connection
}) {
	const blocks = connection.getLatestBlockhash()
	const airDrop = connection.requestAirdrop(payer.publicKey, 10000000000)

	const [latestBlockhash, signature] = await Promise.all([blocks, airDrop])

	await connection.confirmTransaction(
		{
			...latestBlockhash,
			signature,
		},
		'confirmed',
	)
}

function getAssociatedAddress({
	mint,
	owner,
}: {
	mint: PublicKey
	owner: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[owner.toBuffer(), TOKEN_2022_PROGRAM_ID.toBuffer(), mint.toBuffer()],
		ASSOCIATED_TOKEN_PROGRAM_ID,
	)[0]
}

function getPoolPda({ program }: { program: Program<Degenerator> }): PublicKey {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('pool')],
		program.programId,
	)[0]
}

async function buildTransaction({
	connection,
	payer,
	signers,
	instructions,
}: {
	connection: Connection
	payer: PublicKey
	signers: Signer[]
	instructions: TransactionInstruction[]
}): Promise<VersionedTransaction> {
	const { blockhash } = await connection.getLatestBlockhash()

	const messageV0 = new TransactionMessage({
		payerKey: payer,
		recentBlockhash: blockhash,
		instructions,
	}).compileToV0Message()

	const tx = new VersionedTransaction(messageV0)

	signers.forEach(s => tx.sign([s]))

	return tx
}

async function sendAndConfirm({
	connection,
	tx,
}: {
	connection: Connection
	tx: VersionedTransaction
}) {
	const blocks = connection.getLatestBlockhash()
	const send = connection.sendTransaction(tx)

	const [latestBlockhash, signature] = await Promise.all([blocks, send])

	await connection.confirmTransaction(
		{
			...latestBlockhash,
			signature,
		},
		'confirmed',
	)

	return signature
}

interface GetMintInstructionsParams {
	program: Program<Degenerator>
	payer: PublicKey
	mint: PublicKey

	metadata: { name: string; symbol: string; uri: string }
	decimals: number
	supply: number
}

async function getMintInstructions({
	program,
	payer,
	mint,

	metadata,
	decimals,
	supply,
}: GetMintInstructionsParams) {
	// Convert supply to BN (BigNumber) instance
	const supplyBN = new BN(supply)

	// Calculate 90% of the supply
	const transferAmount = supplyBN.mul(new BN(90)).div(new BN(100))

	const payerATA = getAssociatedAddress({
		mint: mint,
		owner: payer,
	})

	const pda = getPoolPda({ program })

	const receiverATA = getAssociatedAddress({
		mint: mint,
		owner: pda,
	})

	const init = await program.methods
		.initialize(decimals, metadata)
		.accounts({
			mintAccount: mint,
			payer: payer,
		})
		.instruction()

	const createAtaPayer = await program.methods
		.createAssociatedTokenAccount()
		.accounts({
			tokenAccount: payerATA,
			mint: mint,
			signer: payer,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	const mintToken = await program.methods
		.mintToken(supplyBN)
		.accounts({
			mint: mint,
			signer: payer,
			receiver: payerATA,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	const createPool = await program.methods
		.createPool()
		.accounts({
			payer: payer,
			tokenAccount: receiverATA,
			mint: mint,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	const transfer = await program.methods
		.transferToken(transferAmount)
		.accounts({
			mint: mint,
			signer: payer,
			from: payerATA,
			to: pda.toBase58(),
			tokenProgram: TOKEN_2022_PROGRAM_ID,
			toAta: receiverATA,
		})
		.instruction()

	const instructions = [init, createAtaPayer, mintToken, createPool, transfer]

	return instructions
}

export {
	type Degenerator,
	airDrop,
	getAssociatedAddress,
	getPoolPda,
	buildTransaction,
	getMintInstructions,
	sendAndConfirm,
}
export { default as IDL } from '../target/idl/degenerator.json'
