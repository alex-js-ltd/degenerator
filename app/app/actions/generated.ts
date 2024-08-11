import { prisma } from '@/app/utils/db'
import { cache } from 'react'
import 'server-only'

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
