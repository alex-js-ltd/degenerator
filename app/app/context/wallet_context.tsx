'use client'

import { type ReactNode, useMemo } from 'react'
import { UnifiedWalletProvider } from '@jup-ag/wallet-adapter'

import { getEnv } from '@/app/utils/env'

const { CLUSTER } = getEnv()

const noop = () => {}

type Params = Omit<Parameters<typeof UnifiedWalletProvider>[0], 'children'>

export function WalletProvider({ children }: { children: ReactNode }) {
	const params: Params = useMemo(
		() => ({
			wallets: [],
			config: {
				autoConnect: true,
				env: CLUSTER,
				metadata: {
					name: 'Degenerator',
					description: 'Generate SPL Tokens on Solana',
					url: 'https://www.degenerator.dev',
					iconUrls: ['https://www.degenerator.dev/favicon.ico'],
				},
				notificationCallback: {
					onConnect: noop,
					onConnecting: noop,
					onDisconnect: noop,
					onNotInstalled: noop,
				},
				walletlistExplanation: {
					href: 'https://station.jup.ag/docs/additional-topics/wallet-list',
				},
				theme: 'light',
				lang: 'en',
			},
		}),
		[],
	)

	return <UnifiedWalletProvider {...params}>{children}</UnifiedWalletProvider>
}
