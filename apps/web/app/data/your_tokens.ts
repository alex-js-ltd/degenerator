'use server'

import { prisma } from '@/app/utils/db'
import { cache } from 'react'

async function fetchYourTokens(pk: string) {
	const user = await prisma.user.findUnique({
		where: {
			id: pk,
		},

		include: {
			tokenMetadata: true,
		},
	})

	return { data: user?.tokenMetadata }
}

const preload = (pk: string) => {
	void getYourTokens(pk)
}

const getYourTokens = cache(async (pk: string) => {
	const tokens = await fetchYourTokens(pk)
	return tokens
})

export { preload, getYourTokens }
