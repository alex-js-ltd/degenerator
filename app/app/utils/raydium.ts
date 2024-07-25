import {
	Raydium,
	TxVersion,
	DEV_API_URLS,
	API_URLS,
} from '@raydium-io/raydium-sdk-v2'
import { connection } from '@/app/utils/setup'
import { PublicKey } from '@solana/web3.js'
import { getEnv } from '@/app/utils/env'

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

export * from '@raydium-io/raydium-sdk-v2'
export { initSdk, txVersion, cluster }
