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
	revoke?: boolean | undefined
}

async function getMintInstructions({
	program,
	payer,
	mint,
	metadata,
	decimals,
	supply,
	revoke,
}: GetMintInstructionsParams) {
	const tokenAccount = getAssociatedAddress({
		mint: mint,
		owner: payer,
	})

	const init = await program.methods
		.initialize(decimals, metadata)
		.accounts({
			mintAccount: mint,
			payer: payer,
		})
		.instruction()

	const createAta = await program.methods
		.createAssociatedTokenAccount()
		.accounts({
			tokenAccount: tokenAccount,
			mint: mint,
			signer: payer,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	const mintToken = await program.methods
		.mintToken(new BN(supply))
		.accounts({
			mint: mint,
			signer: payer,
			receiver: tokenAccount,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	const revokeMint =
		revoke &&
		(await program.methods
			.revokeMintAuthority()
			.accounts({
				currentAuthority: payer,
				mintAccount: mint,
			})
			.instruction())

	const revokeFreeze =
		revoke &&
		(await program.methods
			.revokeFreezeAuthority()
			.accounts({
				currentAuthority: payer,
				mintAccount: mint,
			})
			.instruction())

	const instructions = [init, createAta, mintToken, revokeMint, revokeFreeze]

	return instructions.reduce<web3.TransactionInstruction[]>((acc, curr) => {
		if (curr) acc.push(curr)
		return acc
	}, [])
}

export {
	type Degenerator,
	airDrop,
	getAssociatedAddress,
	buildTransaction,
	getMintInstructions,
	sendAndConfirm,
}
export { default as IDL } from '../target/idl/degenerator.json'
