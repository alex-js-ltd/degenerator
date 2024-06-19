import {
	Raydium,
	TxVersion,
	parseTokenAccountResp,
} from '@raydium-io/raydium-sdk-v2'
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { connection } from '@/app/utils/setup'
import { getEnv } from '@/app/utils/env'

import { useCallback } from 'react'

type InitSdkProps = {
	owner: PublicKey
	loadToken: Boolean
}

const { CLUSTER } = getEnv()

export function useClmm() {
	const initSdk = useCallback(async (params: InitSdkProps) => {
		const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

		const raydium = await Raydium.load({
			owner: params.owner,
			connection,
			cluster,
			disableFeatureCheck: true,
			disableLoadToken: !params?.loadToken,
			blockhashCommitment: 'finalized',
			// urlConfigs: {
			//   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
			// },
		})

		return raydium
	}, [])

	return { initSdk }
}
