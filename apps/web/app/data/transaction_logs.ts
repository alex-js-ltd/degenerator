'use server'

import { PublicKey } from '@solana/web3.js'
import { connection } from '@/app/utils/setup'
import { cache } from 'react'

async function fetchTransactions(pk: PublicKey) {
	const transactionList = await connection.getSignaturesForAddress(pk, {
		limit: 1000,
	})

	const signatureList = transactionList.map(
		transaction => transaction.signature,
	)
	const transactionDetails = await connection.getParsedTransactions(
		signatureList,
		{ maxSupportedTransactionVersion: 0 },
	)

	transactionDetails.forEach((transaction, i) => {
		console.log(transaction?.meta?.logMessages)
		console.log('-'.repeat(20))
	})

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
