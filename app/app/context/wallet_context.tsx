'use client'

import { type ReactNode } from 'react'
import {
	ConnectionProvider,
	UnifiedWalletProvider,
} from '@jup-ag/wallet-adapter'

import { getEnv } from '@/app/utils/env'

const { ENDPOINT, CLUSTER } = getEnv()

export function WalletProvider({ children }: { children: ReactNode }) {
	return (
		<ConnectionProvider endpoint={ENDPOINT}>
			<UnifiedWalletProvider
				wallets={[]}
				config={{
					autoConnect: true,
					env: CLUSTER,
					metadata: {
						name: 'Degenerator',
						description: 'Generate SPL Tokens on Solana',
						url: 'https://www.degenerator.dev',
						iconUrls: [],
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
