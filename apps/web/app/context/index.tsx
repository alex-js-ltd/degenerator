'use client'

import type { ReactNode } from 'react'
import { WalletProvider } from './wallet_context'
import { TxProvider } from './tx_context'
import { ImageProvider } from './image_context'

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<WalletProvider>
			<TxProvider>
				<ImageProvider>{children}</ImageProvider>
			</TxProvider>
		</WalletProvider>
	)
}
