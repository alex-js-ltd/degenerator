'use server'

import { prisma } from '@/app/utils/db'
import { cache } from 'react'

async function fetchYourTokens(pk: string) {
	const tokens = await prisma.tokenMetadata.findMany({
		where: {
			owner: {
				publicKey: pk,
			},
		},
	})

	return { data: tokens }
}

const preload = (pk: string) => {
	void getYourTokens(pk)
}

const getYourTokens = cache(async (pk: string) => {
	const tokens = await fetchYourTokens(pk)
	return tokens
})

export { preload, getYourTokens }
