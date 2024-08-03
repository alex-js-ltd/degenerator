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
