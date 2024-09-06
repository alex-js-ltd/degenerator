'use server'

import { prisma } from '@/app/utils/db'
import { PublicKey } from '@solana/web3.js'
import { connection } from '@/app/utils/setup'
import invariant from 'tiny-invariant'

export async function getUser(pk: PublicKey) {
	const account = await connection.getAccountInfo(pk)

	invariant(account, 'no account')

	const publicKey = pk.toBase58()

	const existingUser = await prisma.user.findUnique({
		where: { id: publicKey },
	})

	if (existingUser) return existingUser

	const newUser = await prisma.user.create({
		data: {
			id: publicKey,
		},
	})

	return newUser
}
