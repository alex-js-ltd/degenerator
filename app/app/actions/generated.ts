'use server'

import { prisma } from '@/app/utils/db'
import { cache } from 'react'

async function fetchGeneratedTokens(pk: string) {
	const tokens = await prisma.tokenMetadata.findMany({
		where: {
			owner: {
				publicKey: pk,
			},
		},
	})

	return tokens
}

export const preload = (pk: string) => {
	void getGeneratedTokens(pk)
}

export const getGeneratedTokens = cache(async (pk: string) => {
	const tokens = await fetchGeneratedTokens(pk)
	return tokens
})
