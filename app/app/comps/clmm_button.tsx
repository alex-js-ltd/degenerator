'use client'

import { useRef, useEffect } from 'react'
import { clmm } from '@/app/actions/clmm'
import { useFormState } from 'react-dom'
import { usePoolTx } from '@/app/context/tx_context'

const initialState = {
	serializedTransaction: undefined,
}

export function ClmmButton() {
	const [lastResult, action] = useFormState(clmm, initialState)
	const { serializedTransaction: tx } = lastResult
	const { run, sign } = usePoolTx()
	const buttonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (buttonRef.current) {
			buttonRef.current.click()
		}
	}, [])

	useEffect(() => {
		if (tx) run(sign(tx))
	}, [run, sign, tx])

	return (
		<button
			ref={buttonRef}
			type="submit"
			className="sr-only"
			formAction={action}
		/>
	)
}
