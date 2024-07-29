import React, {
	type MouseEvent,
	useRef,
	useEffect,
	useCallback,
	useMemo,
} from 'react'
import { useFormState } from 'react-dom'
import { type ButtonProps } from '@/app/comps/button'

type Button = Omit<ButtonProps, 'formAction'>

export function useServerAction<State>(
	action: (state: Awaited<State>) => State | Promise<State>,
	initialState: Awaited<State>,
	start: boolean,
): any

export function useServerAction<State, Payload>(
	action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
	initialState: Awaited<State>,
	start: boolean,
): any

export function useServerAction<State, Payload>(
	action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
	initialState: Awaited<State>,
	start: boolean,
) {
	const [lastResult, formAction] = useFormState(action, initialState)

	const buttonRef = useRef<HTMLButtonElement>(null)

	function getButtonProps(): ButtonProps {
		return {
			ref: buttonRef,
			type: 'submit',
			className: 'sr-only',
			formAction,
			onClick: (e: MouseEvent<HTMLButtonElement>) => e.stopPropagation(),
		}
	}

	return { getButtonProps }
}
