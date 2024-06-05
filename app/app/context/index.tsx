'use client'

import type { ReactNode } from 'react'
import { WalletProvider } from './wallet_context'

export function AppProviders({ children }: { children: ReactNode }) {
	return <WalletProvider>{children}</WalletProvider>
}
