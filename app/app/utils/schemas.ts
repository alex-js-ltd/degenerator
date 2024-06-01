import { z } from 'zod'

const MAX_UPLOAD_SIZE = 1024 * 1024 * 4.5 // 10MB

export const TokenSchema = z.object({
	payer: z.string(),
	name: z.string(),
	symbol: z.string(),
	decimals: z.number(),
	supply: z.number(),
	description: z.string(),
	image: z.instanceof(File).refine(file => {
		return !file || file.size <= MAX_UPLOAD_SIZE
	}, 'File size must be less than 4.5MB'),
})
