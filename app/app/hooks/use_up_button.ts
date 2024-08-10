import { useCallback, useEffect } from 'react'
import { type Control } from '@/app/hooks/use_control_input'
import { type ButtonProps } from '@/app/comps/button'

export function useUpButton(max: number | null | undefined, control: Control) {
	// Memoize getButtonProps using useCallback
	const onClick = useCallback(() => {
		if (!max) return {}

		const increment = max * 0.25

		control.change(prev => {
			const prevValue = prev ? parseFloat(prev) : 0 // Convert prev to a number

			// Calculate new value
			const newValue = prevValue + increment

			// Ensure new value does not exceed max
			const cappedValue = Math.min(newValue, max)

			return cappedValue.toString() // Return the result as a string
		})
	}, [max, control])

	return { onClick }
}
