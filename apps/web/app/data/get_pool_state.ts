'use server'

import { cache } from 'react'
import { fetchBondingCurveState } from '@repo/degenerator'
import { program } from '@/app/utils/setup'
import { PublicKey } from '@solana/web3.js'

export const preload = (mint: string) => {
	void getPoolState(mint)
}

export const getPoolState = cache(async (mint: string) => {
	const data = await fetchBondingCurveState({
		program,
		mint: new PublicKey(mint),
	})

	return data
})
