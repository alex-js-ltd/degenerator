'use server'

import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { connection } from '@/app/utils/setup'
import { cache } from 'react'

async function fetchBalance(pk: PublicKey) {
	const res = await connection.getBalance(pk)
	return res / LAMPORTS_PER_SOL
}

export const preload = (pk: string) => {
	void getBalance(pk)
}

export const getBalance = cache(async (pk: string) => {
	const balance = await fetchBalance(new PublicKey(pk))
	return balance
})
