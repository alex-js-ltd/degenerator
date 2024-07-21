'use client'

import React, {
	createContext,
	ReactNode,
	useEffect,
	useMemo,
	use,
	useCallback,
} from 'react'
import { useAsync } from '@/app/hooks/use_async'
import { useSignAndSendTransaction } from '@/app/hooks/use_sign_and_send_transaction'
import invariant from 'tiny-invariant'

type Async<DataType> = ReturnType<typeof useAsync<DataType>>
type Context = Array<Async<string | undefined>>
const TxContext = createContext<Context | undefined>(undefined)
TxContext.displayName = 'TxContext'

function TxProvider({ children }: { children: ReactNode }) {
	const mintTx = useAsync<string | undefined>()
	const poolTx = useAsync<string | undefined>()

	const value = useMemo(() => {
		return [mintTx, poolTx]
	}, [mintTx, poolTx])

	return <TxContext.Provider value={value}>{children}</TxContext.Provider>
}

function useTx() {
	const context = use(TxContext)
	invariant(context, 'useTx must be used within a TxProvider')
	return context
}

function useMintTx(tx?: Uint8Array) {
	const [mintTx] = useTx()
	const { run, ...rest } = mintTx

	const sign = useSignAndSendTransaction()

	useEffect(() => {
		if (tx) run(sign(tx))
	}, [run, sign, tx])

	return { ...rest }
}

function usePoolTx(tx?: Uint8Array) {
	const [, poolTx] = useTx()
	const { run, ...rest } = poolTx

	const sign = useSignAndSendTransaction()

	useEffect(() => {
		if (tx) run(sign(tx))
	}, [run, sign, tx])

	return { ...rest }
}

function useTxStatus() {
	const txs = useTx()
	return { isLoading: txs.map(tx => tx.isLoading).some(Boolean) }
}

function useReset() {
	const txs = useTx()

	return useCallback(() => {
		txs.forEach(tx => tx.reset())
	}, [txs])
}

export { TxProvider, useTx, useMintTx, usePoolTx, useTxStatus, useReset }
