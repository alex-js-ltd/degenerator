import { prisma } from '@/app/utils/db'
import { cache } from 'react'
import 'server-only'

async function fetchFeaturedTokens() {
	const tokens = await prisma.tokenMetadata.findMany({
		take: 4,
	})

	return { data: tokens }
}

export const getFeaturedTokens = cache(async () => {
	const tokens = await fetchFeaturedTokens()
	return tokens
})

export { fetchFeaturedTokens }
