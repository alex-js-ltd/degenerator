'use client'

import { useRef, useEffect } from 'react'
import { clmm } from '@/app/actions/clmm'
import { useFormState } from 'react-dom'
import { useTransaction } from '@/app/hooks/use_transaction'

const initialState = {
	serializedTransaction: undefined,
}

export function ClmmButton() {
	const [lastResult, action] = useFormState(clmm, initialState)

	const { serializedTransaction } = lastResult

	const buttonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		const buttonEl = buttonRef.current
		if (buttonEl) {
			buttonEl.click()
		}
	}, [])

	useTransaction(serializedTransaction)

	return (
		<button
			ref={buttonRef}
			type="submit"
			className="sr-only"
			formAction={action}
		/>
	)
}
