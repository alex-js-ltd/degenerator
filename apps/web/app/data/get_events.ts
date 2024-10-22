'use server'

import { PublicKey } from '@solana/web3.js'
import { connection } from '@/app/utils/setup'
import { cache } from 'react'
import { EventParser, BorshCoder, Event } from '@coral-xyz/anchor'
import { program } from '@/app/utils/setup'
import { IdlEvent } from '@coral-xyz/anchor/dist/cjs/idl'

async function fetchEvents(pk: PublicKey) {
	const transactionList = await connection.getSignaturesForAddress(pk, {
		limit: 1000,
	})

	const signatureList = transactionList.map(
		transaction => transaction.signature,
	)

	const start: Event<IdlEvent, Record<string, never>>[] = []
	// Use Promise.all with reduce for async processing
	const allParsedEvents = signatureList.reduce(async (accProm, sig) => {
		// Wait for the previous accumulator to resolve
		const acc = await accProm

		const tx = await connection.getParsedTransaction(sig, {
			maxSupportedTransactionVersion: 0,
		})

		if (tx?.meta?.logMessages) {
			const eventParser = new EventParser(
				program.programId,
				new BorshCoder(program.idl),
			)

			const events = eventParser.parseLogs(tx.meta.logMessages)
			const eventArray = Array.from(events)

			for (const event of eventArray) {
				acc.push(event)
			}
		}

		return acc // Return the accumulator if no logs
	}, Promise.resolve(start)) // Initial value is a resolved promise of an empty array

	return allParsedEvents // Return the array of parsed events
}

export const preload = (pk: string) => {
	void getEvents(pk)
}

export const getEvents = cache(async (pk: string) => {
	const mint = new PublicKey(pk)
	const events = await fetchEvents(mint)

	return events
})
