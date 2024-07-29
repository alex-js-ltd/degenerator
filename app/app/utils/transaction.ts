import {
	type Connection,
	type Signer,
	type PublicKey,
	type TransactionInstruction,
	TransactionMessage,
	VersionedTransaction,
	LAMPORTS_PER_SOL,
} from '@solana/web3.js'

import { getEnv } from '@/app/utils/env'

const { CLUSTER } = getEnv()

/**
 * Helper function to build a signed transaction
 */
export async function buildTransaction({
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
	let blockhash = await connection
		.getLatestBlockhash()
		.then(res => res.blockhash)

	const messageV0 = new TransactionMessage({
		payerKey: payer,
		recentBlockhash: blockhash,
		instructions,
	}).compileToV0Message()

	const tx = new VersionedTransaction(messageV0)

	signers.forEach(s => tx.sign([s]))

	return tx
}

/**
 * Auto airdrop the given wallet of of a balance of < 0.5 SOL
 */
export async function airdropOnLowBalance(
	connection: Connection,
	address: PublicKey,
	forceAirdrop: boolean = false,
) {
	if (CLUSTER === 'mainnet-beta') return
	// get the current balance
	let balance = await connection.getBalance(address)

	// define the low balance threshold before airdrop
	const MIN_BALANCE_TO_AIRDROP = LAMPORTS_PER_SOL / 2 // current: 0.5 SOL

	// check the balance of the two accounts, airdrop when low
	if (forceAirdrop === true || balance < MIN_BALANCE_TO_AIRDROP) {
		console.log(`Requesting airdrop of 1 SOL to ${address.toBase58()}...`)
		await connection.requestAirdrop(address, LAMPORTS_PER_SOL)
	}
}
