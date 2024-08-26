import {
	Raydium,
	TxVersion,
	DEV_API_URLS,
	API_URLS,
	CREATE_CPMM_POOL_PROGRAM,
	DEV_CREATE_CPMM_POOL_PROGRAM,
} from '@raydium-io/raydium-sdk-v2'
import { connection } from '@/app/utils/setup'
import { PublicKey } from '@solana/web3.js'
import { getEnv } from '@/app/utils/env'
import { BN } from '@coral-xyz/anchor'
import Decimal from 'decimal.js'

const txVersion = TxVersion.V0

const { CLUSTER } = getEnv()

const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : 'devnet'

const BASE_HOST = {
	mainnet: API_URLS.BASE_HOST,
	devnet: DEV_API_URLS.BASE_HOST,
}

async function initSdk(params: { owner?: PublicKey; loadToken?: boolean }) {
	const raydium = await Raydium.load({
		owner: params.owner,
		connection,
		cluster,
		disableFeatureCheck: true,
		disableLoadToken: !params.loadToken,
		blockhashCommitment: 'finalized',

		urlConfigs: {
			BASE_HOST: BASE_HOST[cluster],
		},
	})

	return raydium
}

const VALID_PROGRAM_ID = new Set([
	CREATE_CPMM_POOL_PROGRAM.toBase58(),
	DEV_CREATE_CPMM_POOL_PROGRAM.toBase58(),
])

function isValidCpmm(id: string) {
	return VALID_PROGRAM_ID.has(id)
}

function getAmount(amount: number, decimals: number): BN {
	// Convert the human-readable token amount to the smallest unit based on its decimals
	const scale = new Decimal(amount).mul(10 ** decimals).toFixed(0)
	// Return the scaled amount as a BN (Big Number) object

	return new BN(scale)
}

export * from '@raydium-io/raydium-sdk-v2'
export { initSdk, isValidCpmm, getAmount, txVersion, cluster }
