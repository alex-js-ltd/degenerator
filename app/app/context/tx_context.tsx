'use client'

import React, { createContext, ReactNode, useEffect, useMemo, use } from 'react'
import { useAsync } from '@/app/hooks/use_async'
import { useSignAndSendTransaction } from '@/app/hooks/use_sign_and_send_transaction'
import invariant from 'tiny-invariant'

type Async<DataType> = ReturnType<typeof useAsync<DataType>>
type Sign = ReturnType<typeof useSignAndSendTransaction>
type Context = {
	mintTx: Async<string | undefined>
	poolTx: Async<string | undefined>
	sign: Sign
}
const TxContext = createContext<Context | undefined>(undefined)
TxContext.displayName = 'TxContext'

function TxProvider({ children }: { children: ReactNode }) {
	const mintTx = useAsync<string | undefined>()
	const poolTx = useAsync<string | undefined>()
	const sign = useSignAndSendTransaction()

	const value = useMemo(() => {
		return { mintTx, poolTx, sign }
	}, [mintTx, poolTx, sign])

	return <TxContext.Provider value={value}>{children}</TxContext.Provider>
}

function useTx() {
	const context = use(TxContext)
	invariant(context, 'useTx must be used within a TxProvider')
	return context
}

function useMintTx(tx?: Uint8Array) {
	const { mintTx, sign } = useTx()
	const { run, ...rest } = mintTx

	useEffect(() => {
		if (tx) run(sign(tx))
	}, [run, sign, tx])

	return { ...rest }
}

function usePoolTx(tx?: Uint8Array) {
	const { poolTx, sign } = useTx()
	const { run, ...rest } = poolTx

	useEffect(() => {
		if (tx) run(sign(tx))
	}, [run, sign, tx])

	return { ...rest }
}

function useTxStatus() {
	const { mintTx, poolTx } = useTx()
	return { isLoading: [mintTx.isLoading, poolTx.isLoading].some(Boolean) }
}

export { TxProvider, useTx, useMintTx, usePoolTx, useTxStatus }
