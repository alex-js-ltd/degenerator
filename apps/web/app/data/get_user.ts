'use server'

import { prisma } from '@/app/utils/db'
import { PublicKey } from '@solana/web3.js'

export async function getUser(pk: PublicKey) {
	const publicKey = pk.toBase58()

	const user = await prisma.user.upsert({
		where: { id: publicKey },
		update: {}, // If user already exists, no updates will be made
		create: { id: publicKey },
	})

	return user
}
