import {
	type Connection,
	type Signer,
	type PublicKey,
	type TransactionInstruction,
	TransactionMessage,
	VersionedTransaction,
	AddressLookupTableProgram,
} from '@solana/web3.js'

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

export async function getLookupTable({
	publicKey,
	connection,
	transaction,
}: {
	connection: Connection
	publicKey: PublicKey
	transaction: VersionedTransaction
}): Promise<TransactionInstruction> {
	// create an Address Lookup Table
	const [, lookupTableAddress] = AddressLookupTableProgram.createLookupTable({
		authority: publicKey,
		payer: publicKey,
		recentSlot: await connection.getSlot(),
	})

	return AddressLookupTableProgram.extendLookupTable({
		payer: publicKey,
		authority: publicKey,
		lookupTable: lookupTableAddress,
		addresses: [...transaction.message.getAccountKeys().staticAccountKeys],
	})
}
