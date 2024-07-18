import React, { createContext, ReactNode, use } from 'react'
import { useAsync } from '@/app/hooks/use_async'
import { useSignAndSendTransaction } from '@/app/hooks/use_sign_and_send_transaction'

type Async<DataType> = ReturnType<typeof useAsync<DataType>>
type Sign = ReturnType<typeof useSignAndSendTransaction>
type Context = {
	mintTx: Async<string | undefined>
	poolTx: Async<string | undefined>
	sign: Sign
	isLoading: boolean
}
const TxContext = createContext<Context | undefined>(undefined)
TxContext.displayName = 'TxContext'

function TxProvider({ children }: { children: ReactNode }) {
	const mintTx = useAsync<string | undefined>()
	const poolTx = useAsync<string | undefined>()
	const sign = useSignAndSendTransaction()
	const isLoading = [mintTx.isLoading, poolTx.isLoading].every(Boolean)
	const value = { mintTx, poolTx, sign, isLoading }
	return <TxContext.Provider value={value}>{children}</TxContext.Provider>
}

function useTx() {
	const context = use(TxContext)
	if (context === undefined) {
		throw new Error('useTx must be used within a TxProvider')
	}
	return context
}

function useMintTx() {
	const { mintTx, sign } = useTx()
	return { ...mintTx, sign }
}

function usePoolTx() {
	const { poolTx, sign } = useTx()
	return { ...poolTx, sign }
}

export { TxProvider, useTx, useMintTx, usePoolTx }
