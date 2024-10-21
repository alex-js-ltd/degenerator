'use server'

import { PublicKey } from '@solana/web3.js'
import { connection } from '@/app/utils/setup'
import { cache } from 'react'

async function fetchTransactions(pk: PublicKey) {
	const transactionList = await connection.getSignaturesForAddress(pk, {
		limit: 1000,
	})

	let signatureList = transactionList.map(transaction => transaction.signature)

	for await (const sig of signatureList) {
		console.log(
			await connection.getParsedTransaction(sig, {
				maxSupportedTransactionVersion: 0,
			}),
		)
	}

	return transactionList
}

export const preload = (pk: string) => {
	void getTransactions(pk)
}

export const getTransactions = cache(async (pk: string) => {
	const mint = new PublicKey(pk)
	const transactions = await fetchTransactions(mint)

	return transactions
})
