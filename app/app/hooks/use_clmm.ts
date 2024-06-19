import {
	Raydium,
	TxVersion,
	parseTokenAccountResp,
	CLMM_PROGRAM_ID,
	DEVNET_PROGRAM_ID,
} from '@raydium-io/raydium-sdk-v2'

import { BN } from '@coral-xyz/anchor'
import Decimal from 'decimal.js'
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { connection } from '@/app/utils/setup'
import { useWallet } from '@jup-ag/wallet-adapter'
import { getEnv } from '@/app/utils/env'
import { useCallback } from 'react'

type InitSdkProps = {
	owner: PublicKey
	loadToken?: Boolean
}
type CreatePoolProps = {
	raydium: Raydium
}

const { CLUSTER } = getEnv()

export const txVersion = TxVersion.V0 // or TxVersion.LEGACY

export function useClmm() {
	const { signAllTransactions } = useWallet()

	const initSdk = useCallback(
		async (params: InitSdkProps) => {
			const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

			const raydium = await Raydium.load({
				owner: params.owner,
				connection,
				cluster,
				disableFeatureCheck: true,
				disableLoadToken: !params?.loadToken,
				blockhashCommitment: 'finalized',
				signAllTransactions,
				// urlConfigs: {
				//   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
				// },
			})

			return raydium
		},
		[signAllTransactions],
	)

	const createPool = useCallback(async ({ raydium }: CreatePoolProps) => {
		try {
			// you can call sdk api to get mint info or paste mint info from api: https://api-v3.raydium.io/mint/list

			// RAY
			const mint1 = await raydium.token.getTokenInfo(
				'A2roS8zfGTiz9tARw7pnUPR4RmProN7JVmxWSRwbj6Bh',
			)

			// USDT
			const mint2 = await raydium.token.getTokenInfo(
				'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
			)

			const clmmConfigs = await raydium.api.getClmmConfigs()

			const { execute, extInfo, ...rest } = await raydium.clmm.createPool({
				programId: CLMM_PROGRAM_ID, // devnet: DEVNET_PROGRAM_ID.CLMM
				mint1,
				mint2,
				ammConfig: {
					...clmmConfigs[0],
					id: new PublicKey(clmmConfigs[0].id),
					fundOwner: '',
				},
				initialPrice: new Decimal(1),
				startTime: new BN(0),
				txVersion,
				// optional: set up priority fee here
				// computeBudgetConfig: {
				//   units: 600000,
				//   microLamports: 100000000,
				// },
			})

			const { txId } = await execute()
			console.log('clmm pool created:', { txId })

			const data = await raydium.api.fetchPoolById({
				ids: extInfo.mockPoolInfo.id,
			})

			console.log('data', data)
			return extInfo
		} catch (error) {
			console.error('Error creating CLMM pool:', error)
		}
	}, [])

	const createPosition = useCallback(async () => {}, [])

	return { initSdk, createPool }
}
