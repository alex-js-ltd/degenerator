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

	const initialValue: number[] = []
	const reducedOutput = await signatureList.reduce(async (accP, curr) => {
		const acc = await accP // Wait for the accumulator promise to resolve
		const tx = await connection.getParsedTransaction(curr, {
			maxSupportedTransactionVersion: 0,
		})

		const fee = tx?.meta?.fee

		if (fee) {
			acc.push(fee) // Push the fee if it exists
		}

		return acc // Return the updated accumulator
	}, Promise.resolve(initialValue)) // Provide an initial promise that resolves to the initial value

	console.log(reducedOutput)

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
