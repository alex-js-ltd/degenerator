'use server'

'use server'

import { prisma } from '@/app/utils/db'
import { cache } from 'react'
import { connection } from '@/app/utils/setup'
import { PublicKey } from '@solana/web3.js'
import { getMint, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'

async function fetchToken(mint: string) {
	const token = await prisma.tokenMetadata.findUnique({
		where: {
			id: mint,
		},
	})

	return { data: token }
}

export const preload = (mint: string) => {
	void getToken(mint)
}

export const getToken = cache(async (mint: string) => {
	const token = await fetchToken(mint)
	try {
		const account = await getMint(
			connection,
			new PublicKey(mint),
			'confirmed',
			TOKEN_2022_PROGRAM_ID,
		)
		console.log('Mint Account:', account)
	} catch (error) {
		console.error('Error fetching mint account:', error)
	}

	return token
})
