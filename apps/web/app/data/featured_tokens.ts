import { prisma } from '@/app/utils/db'
import { unstable_cache } from 'next/cache'
import 'server-only'

async function fetchFeaturedTokens() {
	const tokens = await prisma.tokenMetadata.findMany({
		take: 10,
	})

	return { data: tokens }
}

export const getFeaturedTokens = unstable_cache(
	async () => {
		const tokens = await fetchFeaturedTokens()
		return tokens
	},
	['tokens'],
	{ revalidate: 3600, tags: ['tokens'] },
)

export { fetchFeaturedTokens }
