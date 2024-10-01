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

export async function getBalance({
	connection,
	address,
}: {
	connection: Connection
	address: PublicKey
}) {
	const res = await connection.getBalance(address)
	return res
}

export async function sendTransaction(
	connection: Connection,
	ixs: TransactionInstruction[],
	signers: Array<Signer>,
	options?: ConfirmOptions,
): Promise<TransactionSignature> {
	const tx = new Transaction()
	for (var i = 0; i < ixs.length; i++) {
		tx.add(ixs[i])
	}

	if (options == undefined) {
		options = {
			preflightCommitment: 'confirmed',
			commitment: 'confirmed',
		}
	}

	const sendOpt = options && {
		skipPreflight: options.skipPreflight,
		preflightCommitment: options.preflightCommitment || options.commitment,
	}

	tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
	const signature = await connection.sendTransaction(tx, signers, sendOpt)

	const status = (
		await connection.confirmTransaction(signature, options.commitment)
	).value

	if (status.err) {
		throw new Error(
			`Raw transaction ${signature} failed (${JSON.stringify(status)})`,
		)
	}
	return signature
}
