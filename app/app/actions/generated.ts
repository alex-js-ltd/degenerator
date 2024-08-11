'use server'

import { prisma } from '@/app/utils/db'
import { cache } from 'react'

async function fetchGeneratedTokens() {
	const tokens = await prisma.tokenMetadata.findMany({
		take: 10,
	})

	return tokens
}

export const getGeneratedTokens = cache(async () => {
	const tokens = await fetchGeneratedTokens()
	return { tokens }
})
