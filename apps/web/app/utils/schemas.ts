import { z } from 'zod'
import { PublicKey as PK } from '@solana/web3.js'

const MAX_UPLOAD_SIZE = 1024 * 1024 * 4.5 // 10MB

const PublicKey = z
	.string()
	.transform(value => new PK(value))
	.refine(value => PK.isOnCurve(value.toBytes()), {
		message: 'Not on the ed25519 curve',
	})

export const MintSchema = z.object({
	payer: PublicKey,
	name: z.string(),
	symbol: z.string(),
	decimals: z
		.number({
			invalid_type_error: 'Expected Number',
		})
		.max(9, { message: 'Decimal is too high' })
		.min(0, { message: 'Decimal is too low' }),
	supply: z
		.number({
			invalid_type_error: 'Expected Number',
		})
		.min(1, { message: 'Supply is too low' }),
	description: z.string(),
	image: z.instanceof(File).refine(file => {
		return !file || file.size <= MAX_UPLOAD_SIZE
	}, 'File size must be less than 4.5MB'),
})

export const AuthSchema = z.object({
	publicKey: PublicKey,
})

export const DeleteSchema = z.object({
	mint: z.string(),
	ownerId: z.string(),
})
