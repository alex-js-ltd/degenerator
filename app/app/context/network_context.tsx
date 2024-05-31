'use client'

import { useLocalStorage } from '@jup-ag/wallet-adapter'
import { createContext, useContext, type ReactNode } from 'react'

export interface NetworkConfigurationState {
	networkConfiguration: string
	setNetworkConfiguration(networkConfiguration: string): void
}

export const NetworkConfigurationContext =
	createContext<NetworkConfigurationState>({} as NetworkConfigurationState)

export function useNetworkConfiguration(): NetworkConfigurationState {
	const context = useContext(NetworkConfigurationContext)

	if (context === undefined) {
		throw new Error(
			`useNetworkConfiguration must be used within a NetworkProvider`,
		)
	}
	return context
}

export function NetworkProvider({ children }: { children: ReactNode }) {
	const [networkConfiguration, setNetworkConfiguration] = useLocalStorage(
		'network',
		'mainnet-beta',
	)

	return (
		<NetworkConfigurationContext.Provider
			value={{ networkConfiguration, setNetworkConfiguration }}
		>
			{children}
		</NetworkConfigurationContext.Provider>
	)
}
