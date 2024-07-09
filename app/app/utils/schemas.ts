import { z } from 'zod'
import { PublicKey as PK } from '@solana/web3.js'

const MAX_UPLOAD_SIZE = 1024 * 1024 * 4.5 // 10MB

const PublicKey = z
	.string()
	.transform(value => new PK(value))
	.refine(value => PK.isOnCurve(value.toBytes()), {
		message: 'Not on the ed25519 curve',
	})

export const TokenSchema = z
	.object({
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
		clmm: z
			.string()
			.transform(value => value === 'on')
			.optional(),

		mint1: PublicKey.optional(),
		mint2: PublicKey.optional(),
		feeTier: z.string().optional(),
	})
	.superRefine(({ clmm, mint1, mint2, feeTier }, context) => {
		if (clmm && !mint1) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'mint1 is Required',
				path: ['mint1'],
			})
		}

		if (clmm && !mint2) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'mint2 is Required',
				path: ['mint2'],
			})
		}

		if (clmm && !feeTier) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'feeTier is Required',
				path: ['feeTier'],
			})
		}
	})

export const ClmmSchema = z.object({
	payerKey: PublicKey,
	mint1: PublicKey,
	mint2: PublicKey,
	feeTier: z.string(),
})
