import { z } from 'zod'

const schema = z.object({
	NEXT_PUBLIC_CLUSTER: z.enum(['devnet', 'mainnet-beta'] as const),
	NEXT_PUBLIC_ENDPOINT: z.enum([
		'https://api.devnet.solana.com',
		'https://intensive-autumn-snowflake.solana-mainnet.quiknode.pro',
	] as const),
})

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof schema> {}
	}
}

/**
 *
 * NOTE: Do *not* add any environment variables in here that you do not wish to
 * be included in the client.
 * @returns all public ENV variables
 */
export function getEnv() {
	return {
		CLUSTER: process.env.NEXT_PUBLIC_CLUSTER,
		ENDPOINT: process.env.NEXT_PUBLIC_ENDPOINT,
	}
}

type ENV = ReturnType<typeof getEnv>

declare global {
	var ENV: ENV
	interface Window {
		ENV: ENV
	}
}
