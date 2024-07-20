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
	symbol: z.string().max(5, { message: 'Symbol is too long' }),
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
	clmm: z
		.string()
		.transform(value => value === 'on')
		.optional(),
})

export const ClmmSchema = z.object({
	payerKey: PublicKey,
	mint1: PublicKey,
	mint2: PublicKey,
	feeTierId: z.string(),
	initialPrice: z.preprocess(val => Number(val), z.number()),
})

export const ClmmOptions = ClmmSchema.partial()

export const Schema = z
	.intersection(TokenSchema, ClmmOptions)
	.superRefine(({ clmm, mint2, feeTierId, initialPrice }, context) => {
		if (clmm && !mint2) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Required',
				path: ['mint2'],
			})
		}

		if (clmm && !feeTierId) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Required',
				path: ['feeTierId'],
			})
		}

		if (clmm && !initialPrice) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Required',
				path: ['initialPrice'],
			})
		}
	})
