'use server'

import { PublicKey } from '@solana/web3.js'
import { connection, program } from '@/app/utils/setup'
import { cache } from 'react'
import { fetchEvents } from '@repo/degenerator'

export const preload = (pk: string) => {
	void getEvents(pk)
}

export const getEvents = cache(async (pk: string) => {
	const mint = new PublicKey(pk)
	const events = await fetchEvents({
		connection,
		program,
		mint,
		eventName: 'swapEvent',
	})

	return events
})
