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
import { useSignAndSendTx } from '@/app/hooks/use_sign_and_send_tx'
import { useFormStatus } from 'react-dom'
import invariant from 'tiny-invariant'
import { useRouter } from 'next/navigation'

type Async<DataType> = ReturnType<typeof useAsync<DataType>>
type Context = Array<Async<string | undefined>>
const TxContext = createContext<Context | undefined>(undefined)
TxContext.displayName = 'TxContext'

function TxProvider({ children }: { children: ReactNode }) {
	const mintTx = useAsync<string | undefined>()
	const swapTx = useAsync<string | undefined>()

	const value = useMemo(() => {
		return [mintTx, swapTx]
	}, [mintTx])

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

	const sign = useSignAndSendTx()
	const router = useRouter()

	useEffect(() => {
		if (!tx) return

		const mint = sign(tx).then(res => {
			router.refresh()
			return res
		})

		run(mint)
	}, [run, sign, tx, router])

	return { ...rest }
}

function useSwapTx(tx?: Uint8Array) {
	const [, swapTx] = useTx()
	const { run, ...rest } = swapTx

	const sign = useSignAndSendTx()
	const router = useRouter()

	useEffect(() => {
		if (!tx) return

		const swap = sign(tx).then(res => {
			router.refresh()
			return res
		})

		run(swap)
	}, [run, sign, tx, router])

	return { ...rest }
}

function useTxStatus() {
	const txs = useTx()
	const { pending } = useFormStatus()
	return { isLoading: [...txs.map(tx => tx.isLoading), pending].some(Boolean) }
}

function useResetTx() {
	const txs = useTx()

	return useCallback(() => {
		txs.forEach(tx => tx.reset())
	}, [txs])
}

export { TxProvider, useTx, useMintTx, useSwapTx, useTxStatus, useResetTx }
