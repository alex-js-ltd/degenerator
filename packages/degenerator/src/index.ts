import { Degenerator } from '../target/types/degenerator'
import { Program, BN, web3, utils } from '@coral-xyz/anchor'

import {
	type Signer,
	type TransactionInstruction,
	Connection,
	PublicKey,
	TransactionMessage,
	VersionedTransaction,
	LAMPORTS_PER_SOL,
} from '@solana/web3.js'

import {
	TOKEN_2022_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token'

async function airDrop({
	account,
	connection,
}: {
	account: PublicKey
	connection: Connection
}) {
	const amount = 2 * LAMPORTS_PER_SOL
	const blocks = connection.getLatestBlockhash()
	const airDrop = connection.requestAirdrop(account, amount)

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

function getPoolVault({
	program,
	mint,
}: {
	program: Program<Degenerator>
	mint: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('pool_vault'), mint.toBuffer()],
		program.programId,
	)[0]
}

function getRaydiumVault({
	program,
	mint,
}: {
	program: Program<Degenerator>
	mint: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('raydium_vault'), mint.toBuffer()],
		program.programId,
	)[0]
}

function getPoolState({
	program,
	mint,
}: {
	program: Program<Degenerator>
	mint: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('pool_state'), mint.toBuffer()],
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

async function getBalance({
	connection,
	address,
}: {
	connection: Connection
	address: PublicKey
}) {
	const res = await connection.getBalance(address)
	return res
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

	const payerATA = getAssociatedAddress({
		mint: mint,
		owner: payer,
	})

	const poolVault = getPoolVault({ program, mint })

	const poolATA = getAssociatedAddress({
		mint: mint,
		owner: poolVault,
	})

	const raydiumVault = getRaydiumVault({ program, mint })

	const raydiumATA = getAssociatedAddress({
		mint: mint,
		owner: raydiumVault,
	})

	const [extraMetasAccount] = PublicKey.findProgramAddressSync(
		[utils.bytes.utf8.encode('extra-account-metas'), mint.toBuffer()],
		program.programId,
	)

	const poolState = getPoolState({ program, mint })

	const init = await program.methods

		.createMintAccount(decimals, metadata)
		.accountsStrict({
			payer: payer,
			authority: payer,
			receiver: payer,
			mint: mint,
			mintTokenAccount: payerATA,
			extraMetasAccount: extraMetasAccount,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	const createPool = await program.methods
		.createPool(supplyBN)
		.accountsStrict({
			payer: payer,
			poolAta: poolATA,
			mint: mint,
			poolVault: poolVault,
			raydiumVault: raydiumVault,
			raydiumAta: raydiumATA,
			poolState: poolState,
			payerAta: payerATA,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
			rent: web3.SYSVAR_RENT_PUBKEY,
		})
		.instruction()

	const revokeMint = await program.methods
		.revokeMintAuthority()
		.accounts({
			currentAuthority: payer,
			mintAccount: mint,
		})
		.instruction()

	const revokeFreeze = await program.methods
		.revokeFreezeAuthority()
		.accounts({
			currentAuthority: payer,
			mintAccount: mint,
		})
		.instruction()

	return [init, createPool, revokeFreeze, revokeMint]
}

interface SwapTokenInstructionParams {
	program: Program<Degenerator>
	payer: PublicKey
	mint: PublicKey
	amount: number
}

async function getBuyTokenInstruction({
	program,
	payer,
	mint,
	amount,
}: SwapTokenInstructionParams) {
	const payerATA = getAssociatedAddress({
		mint: mint,
		owner: payer,
	})

	const poolVault = getPoolVault({ program, mint })

	const poolATA = getAssociatedAddress({
		mint: mint,
		owner: poolVault,
	})

	const poolState = getPoolState({ program, mint })

	const amountBN = new BN(amount)
	const buy = await program.methods
		.buyToken(amountBN)
		.accountsStrict({
			mint: mint,
			signer: payer,
			poolAta: poolATA,
			payerAta: payerATA,
			poolVault: poolVault,
			poolState: poolState,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	return buy
}

async function getSellTokenInstruction({
	program,
	payer,
	mint,
	amount,
}: SwapTokenInstructionParams) {
	const payerATA = getAssociatedAddress({
		mint: mint,
		owner: payer,
	})

	const poolVault = getPoolVault({ program, mint })

	const poolATA = getAssociatedAddress({
		mint: mint,
		owner: poolVault,
	})

	const poolState = getPoolState({ program, mint })

	const amountBN = new BN(amount)
	const sell = await program.methods
		.sellToken(amountBN)
		.accountsStrict({
			mint: mint,
			signer: payer,
			payerAta: payerATA,
			poolAta: poolATA,
			poolVault: poolVault,
			poolState: poolState,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	return sell
}

interface FetchPoolStateParams {
	program: Program<Degenerator>
	mint: PublicKey
}

interface PoolState {
	buyPrice: BN
	sellPrice: BN
	currentSupply: BN
	totalSupply: BN
	progress: BN
}

async function fetchPoolState({ program, mint }: FetchPoolStateParams) {
	const pda = getPoolState({ program, mint })

	const data = await program.account.poolState.fetch(pda)

	return data
}

export {
	type Degenerator,
	type PoolState,
	airDrop,
	getAssociatedAddress,
	getPoolVault,
	getRaydiumVault,
	getPoolState,
	buildTransaction,
	getMintInstructions,
	sendAndConfirm,
	getBuyTokenInstruction,
	getSellTokenInstruction,
	getBalance,
	fetchPoolState,
}
export { default as IDL } from '../target/idl/degenerator.json'
