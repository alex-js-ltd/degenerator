import { z } from 'zod'
import { PublicKey as PK } from '@solana/web3.js'

const MAX_UPLOAD_SIZE = 1024 * 1024 * 4.5 // 10MB

const PublicKey = z
	.string()
	.transform(value => new PK(value))
	.refine(value => PK.isOnCurve(value.toBytes()), {
		message: 'Not on the ed25519 curve',
	})

export const TokenSchema = z.object({
	payerKey: PublicKey,
	name: z.string(),
	symbol: z.string(),
	decimals: z
		.number()
		.max(9, { message: 'Decimal is too high' })
		.min(0, { message: 'Decimal is too low' }),
	supply: z.number(),
	description: z.string(),
	image: z.instanceof(File).refine(file => {
		return !file || file.size <= MAX_UPLOAD_SIZE
	}, 'File size must be less than 4.5MB'),
	revokeMint: z
		.string()
		.transform(value => value === 'on')
		.optional(),
	revokeFreeze: z
		.string()
		.transform(value => value === 'on')
		.optional(),

	quoteToken: PublicKey,
	feeTier: z.string().optional(),
})

export const ClmmSchema = z.object({
	owner: PublicKey,
	mint1: PublicKey,
})
