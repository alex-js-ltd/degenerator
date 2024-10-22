'use server'

import { PublicKey } from '@solana/web3.js'
import { connection } from '@/app/utils/setup'
import { cache } from 'react'
import { Program, BN, web3, EventParser, BorshCoder } from '@coral-xyz/anchor'
import { program } from '@/app/utils/setup'

async function fetchTransactions(pk: PublicKey) {
	const transactionList = await connection.getSignaturesForAddress(pk, {
		limit: 1000,
	})

	let signatureList = transactionList.map(transaction => transaction.signature)

	for await (const sig of signatureList) {
		const tx = await connection.getParsedTransaction(sig, {
			maxSupportedTransactionVersion: 0,
		})

		if (tx?.meta?.logMessages) {
			const eventParser = new EventParser(
				program.programId,
				new BorshCoder(program.idl),
			)

			// Parse the logs
			const events = eventParser.parseLogs(tx.meta.logMessages)

			const eventArray = Array.from(events)

			// Iterate through the parsed events
			for (const event of eventArray) {
				console.log('Parsed Event:', event)
			}
		}
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
