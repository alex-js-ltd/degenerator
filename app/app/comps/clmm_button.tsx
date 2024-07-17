'use client'

import { useRef, useEffect } from 'react'
import { clmm } from '@/app/actions/clmm'
import { useFormState } from 'react-dom'
import { useSignAndSendTransaction } from '@/app/hooks/use_sign_and_send_transaction'

const initialState = {
	serializedTransaction: undefined,
}

interface ClmmButtonProps {
	run: (
		promise: Promise<string | undefined>,
	) => Promise<(string | undefined) | unknown>
}
export function ClmmButton({ run }: ClmmButtonProps) {
	const [lastResult, action] = useFormState(clmm, initialState)
	const { serializedTransaction: tx } = lastResult
	const sign = useSignAndSendTransaction()
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
