'use client'

import { useRef, useEffect } from 'react'
import { clmm } from '@/app/actions/clmm'
import { useFormState } from 'react-dom'
import { usePoolTx, useTx } from '@/app/context/tx_context'

const initialState = {
	serializedTransaction: undefined,
	poolId: undefined,
}

export function ClmmButton() {
	const [lastResult, action] = useFormState(clmm, initialState)
	const { serializedTransaction: tx, poolId } = lastResult

	const buttonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (buttonRef.current) {
			buttonRef.current.click()
		}
	}, [])

	const { mintTx } = useTx()

	usePoolTx(tx)

	return (
		<button
			ref={buttonRef}
			type="submit"
			className="sr-only"
			formAction={action}
			disabled={mintTx.data ? false : true}
		/>
	)
}
