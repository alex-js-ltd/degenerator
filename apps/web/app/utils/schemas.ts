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
	cpmm: z
		.string()
		.transform(value => value === 'on')
		.optional(),
})

export const PoolSchema = z.object({
	payer: PublicKey,
	mintA: PublicKey,
	mintB: PublicKey,
	mintAAmount: z.number({
		invalid_type_error: 'Expected Number',
	}),

	mintBAmount: z.number({
		invalid_type_error: 'Expected Number',
	}),
})

export const DepositSchema = z.object({
	payer: PublicKey,
	poolId: z.string(),
	amount: z.number(),
})

export const TokenSchema = z
	.intersection(MintSchema, PoolSchema.partial())
	.superRefine(({ cpmm, mintB, mintAAmount, mintBAmount, supply }, context) => {
		if (cpmm && !mintB) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Required',
				path: ['mintB'],
			})
		}

		if (cpmm && !mintAAmount) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Required',
				path: ['mintAAmount'],
			})
		}

		if (cpmm && !mintBAmount) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Required',
				path: ['mintBAmount'],
			})
		}

		if (cpmm && mintAAmount && mintAAmount >= supply) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'mintAAmount is too high',
				path: ['mintAAmount'],
			})
		}
	})
