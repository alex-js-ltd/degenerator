import { useRef, useEffect, useCallback, useMemo } from 'react'
import { type ButtonProps } from '@/app/comps/button'

/**
 * Custom hook to programmatically trigger a server action.
 *
 * @param {Action} formAction - The server action to be triggered, defined as a function that takes a FormData payload and returns void.
 * @param {unknown} start - A dependency to control when the action should be triggered.
 */

type Action = (payload: FormData) => void

export function useServerAction(formAction: Action, start: unknown) {
	// Create a ref to the button element
	const buttonRef = useRef<HTMLButtonElement>(null)

	// Memoize a boolean value indicating whether to trigger the action
	const trigger = useMemo(() => Boolean(start), [start])

	// Effect to programmatically click the button when `trigger` is true
	useEffect(() => {
		if (buttonRef.current && trigger) {
			buttonRef.current.click()
		}
	}, [trigger])

	// Return a callback that provides button properties
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
