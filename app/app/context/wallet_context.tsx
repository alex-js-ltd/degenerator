'use client'

import { type ReactNode } from 'react'
import { UnifiedWalletProvider } from '@jup-ag/wallet-adapter'

import { getEnv } from '@/app/utils/env'

const { CLUSTER } = getEnv()

const noop = () => {}

export function WalletProvider({ children }: { children: ReactNode }) {
	return (
		<UnifiedWalletProvider
			wallets={[]}
			config={{
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
			}}
		>
			{children}
		</UnifiedWalletProvider>
	)
}
