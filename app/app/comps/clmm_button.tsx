'use client'

import { useRef, useEffect } from 'react'
import { clmm } from '@/app/actions/clmm'
import { useFormState } from 'react-dom'
import { usePoolTx, useTx } from '@/app/context/tx_context'
import { useGetTransaction } from '@/app/hooks/use_get_transaction'

const initialState = {
	serializedTransaction: undefined,
	poolId: undefined,
}

export function ClmmButton() {
	const [lastResult, action] = useFormState(clmm, initialState)
	const { serializedTransaction: tx, poolId } = lastResult

	const buttonRef = useRef<HTMLButtonElement>(null)
	const { mintTx } = useTx()
	const { isSuccess } = useGetTransaction(mintTx?.data)

	useEffect(() => {
		if (buttonRef.current && isSuccess) {
			buttonRef.current.click()
		}
	}, [isSuccess])

	usePoolTx(tx)

	if (!isSuccess) return null

	return (
		<button
			disabled={!isSuccess}
			ref={buttonRef}
			type="submit"
			className="sr-only"
			formAction={action}
		/>
	)
}
