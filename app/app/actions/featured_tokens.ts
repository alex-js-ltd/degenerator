import { prisma } from '@/app/utils/db'
import 'server-only'

async function fetchFeaturedTokens() {
	const tokens = await prisma.tokenMetadata.findMany({
		take: 10,
	})

	return { data: tokens }
}

export { fetchFeaturedTokens }
