'use server'

import { prisma } from '@/app/utils/db'
import { PublicKey } from '@solana/web3.js'
import { connection } from '@/app/utils/setup'
import invariant from 'tiny-invariant'

export async function getUser(pk: PublicKey) {
	const account = await connection.getAccountInfo(pk)

	invariant(account, 'no account')

	const publicKey = pk.toBase58()

	const user = await prisma.user.upsert({
		where: {
			publicKey,
		},
		update: {},
		create: {
			publicKey,
		},
	})

	return user
}
