import React, { useRef, useEffect } from 'react'
import { createPool } from '@/app/actions/create_pool'
import { useFormState } from 'react-dom'
import { usePoolTx, useTx } from '@/app/context/tx_context'

const initialState = {
	serializedTransaction: undefined,
	poolId: undefined,
}

export function PoolForm() {
	const [lastResult, action] = useFormState(createPool, initialState)
	const { serializedTransaction: tx } = lastResult

	const [mintTx] = useTx()

	return <form></form>
}
