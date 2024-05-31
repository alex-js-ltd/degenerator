'use client'

import type { ReactNode } from 'react'
import { NetworkProvider } from './network_context'
import { WalletProvider } from './wallet_context'

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<NetworkProvider>
			<WalletProvider>{children}</WalletProvider>
		</NetworkProvider>
	)
}
