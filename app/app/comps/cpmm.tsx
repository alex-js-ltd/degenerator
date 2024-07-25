import React, { useRef, useEffect } from 'react'
import { cpmm } from '@/app/actions/cpmm'
import { useFormState } from 'react-dom'
import { usePoolTx, useTx } from '@/app/context/tx_context'

const initialState = {
	serializedTransaction: undefined,
	poolId: undefined,
}

export function Cpmm() {
	const [lastResult, action] = useFormState(cpmm, initialState)
	const { serializedTransaction: tx } = lastResult

	const buttonRef = useRef<HTMLButtonElement>(null)
	const [mintTx] = useTx()

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
			onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
		/>
	)
}
