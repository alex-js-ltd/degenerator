'use client'

import { type ReactNode } from 'react'
import {
	ConnectionProvider,
	UnifiedWalletProvider,
} from '@jup-ag/wallet-adapter'

import { getEnv } from '@/app/utils/env'

const { CLUSTER } = getEnv()

export function WalletProvider({ children }: { children: ReactNode }) {
	return (
		<ConnectionProvider endpoint={CLUSTER}>
			<UnifiedWalletProvider
				wallets={[]}
				config={{
					autoConnect: true,
					env: 'mainnet-beta',
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
