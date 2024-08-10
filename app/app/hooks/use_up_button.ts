import { type Control } from '@/app/hooks/use_control_input'
import { type ButtonProps } from '@/app/comps/button'

interface GetButtonProps extends ButtonProps {
	max: number
	control: Control
}

export function useUpButton() {
	function getButtonProps({ max, control }: GetButtonProps) {
		const increment = max * 0.25 // Keep this as a number

		return {
			onClick: () => {
				control.change(prev => {
					const prevValue = prev ? parseFloat(prev) : 0 // Convert prev to a number

					// Calculate new value
					const newValue = prevValue + increment

					// Ensure new value does not exceed max
					const cappedValue = Math.min(newValue, max)

					return cappedValue.toString() // Return the result as a string
				})
			},
		}
	}

	return { getButtonProps }
}
