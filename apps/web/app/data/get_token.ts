'use server'

import { prisma } from '@/app/utils/db'
import { cache } from 'react'
import invariant from 'tiny-invariant'

async function fetchToken(mint: string) {
	const token = await prisma.tokenMetadata.findUnique({
		where: {
			id: mint,
		},
	})

	invariant(token, '🤔')

	return { data: token }
}

export const preload = (mint: string) => {
	void getToken(mint)
}

export const getToken = cache(async (mint: string) => {
	const token = await fetchToken(mint)

	return token
})
