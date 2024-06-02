'use client'

import { useMemo, type ReactNode } from 'react'
import {
	ConnectionProvider,
	UnifiedWalletProvider,
	WalletAdapterNetwork,
} from '@jup-ag/wallet-adapter'
import { useNetworkConfiguration } from './network_context'
import { getEnv } from '@/app/utils/env'
import { clusterApiUrl } from '@solana/web3.js'

const { CLUSTER } = getEnv()

export function WalletProvider({ children }: { children: ReactNode }) {
	const { networkConfiguration } = useNetworkConfiguration()

	const network = networkConfiguration as WalletAdapterNetwork

	const selectedEndpoint: string = useMemo(() => CLUSTER, [network])

	return (
		<ConnectionProvider endpoint={selectedEndpoint}>
			<UnifiedWalletProvider
				wallets={[]}
				config={{
					autoConnect: true,
					env: 'mainnet-beta',
					metadata: {
						name: 'UnifiedWallet',
						description: 'UnifiedWallet',
						url: 'https://jup.ag',
						iconUrls: ['https://jup.ag/favicon.ico'],
					},

					walletlistExplanation: {
						href: 'https://station.jup.ag/docs/additional-topics/wallet-list',
					},
					theme: 'light',
					lang: 'en',
				}}
			>
				{children}
			</UnifiedWalletProvider>
		</ConnectionProvider>
	)
}
