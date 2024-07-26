'use client'

import type { ReactNode } from 'react'
import { WalletProvider } from './wallet_context'
import { TxProvider } from './tx_context'
import { LogoProvider } from './logo_context'

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<WalletProvider>
			<TxProvider>
				<LogoProvider>{children}</LogoProvider>
			</TxProvider>
		</WalletProvider>
	)
}
