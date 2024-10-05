import {
	type Signer,
	type TransactionInstruction,
	type ConfirmOptions,
	TransactionSignature,
	Transaction,
	Connection,
	PublicKey,
	TransactionMessage,
	VersionedTransaction,
	LAMPORTS_PER_SOL,
} from '@solana/web3.js'

export async function airDrop({
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

export async function sendAndConfirm({
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

export async function isRentExempt({
	connection,
	address,
}: {
	connection: Connection
	address: PublicKey
}) {
	const accountInfo = await connection.getAccountInfo(address)

	if (accountInfo === null) {
		throw new Error('Account not found')
	}

	const minRent = await connection.getMinimumBalanceForRentExemption(
		accountInfo.data.length,
	)
	return accountInfo.lamports >= minRent
}
