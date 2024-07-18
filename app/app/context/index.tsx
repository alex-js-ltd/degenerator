'use client'

import type { ReactNode } from 'react'
import { WalletProvider } from './wallet_context'
import { TxProvider } from './tx_context'

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<WalletProvider>
			<TxProvider>{children}</TxProvider>
		</WalletProvider>
	)
}
