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
	const { mintTx } = useTx()

	useEffect(() => {
		if (buttonRef.current && mintTx.data) {
			buttonRef.current.click()
		}
	}, [mintTx.data])

	usePoolTx(tx)

	if (!mintTx.data) return null

	return (
		<button
			disabled={!Boolean(mintTx.data)}
			ref={buttonRef}
			type="submit"
			className="sr-only"
			formAction={action}
		/>
	)
}
