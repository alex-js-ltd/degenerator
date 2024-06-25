import { Raydium } from '@raydium-io/raydium-sdk-v2'
import { useCallback } from 'react'
import { useWallet, useConnection } from '@jup-ag/wallet-adapter'
import { getEnv } from '@/app/utils/env'
import { type PublicKey } from '@solana/web3.js'

const { CLUSTER } = getEnv()
const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

export function useRaydium() {
	const { signAllTransactions } = useWallet()
	const { connection } = useConnection()

	const initSdk = useCallback(
		async (params?: { owner: PublicKey; loadToken?: boolean }) => {
			let raydium = await Raydium.load({
				owner: params?.owner,
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
		[connection, signAllTransactions],
	)

	return { initSdk }
}
