import { useRef, useEffect, useCallback, useMemo } from 'react'
import { type ButtonProps } from '@/app/comps/button'

type Action = (payload: FormData) => void

export function useServerAction(
	formAction: Action,
	txSig: string | null | undefined,
) {
	const buttonRef = useRef<HTMLButtonElement>(null)

	const trigger = useMemo(() => Boolean(txSig), [txSig])

	useEffect(() => {
		if (buttonRef.current && trigger) {
			buttonRef.current.click()
		}
	}, [trigger])

	return useCallback<() => ButtonProps>(() => {
		return {
			ref: buttonRef,
			type: 'submit',
			className: 'sr-only',
			formAction,
			onClick: e => e.stopPropagation(),
		}
	}, [formAction])
}
