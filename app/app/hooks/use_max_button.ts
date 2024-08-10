import { useCallback } from 'react'
import { type Control } from '@/app/hooks/use_control_input'
import { type ButtonProps } from '@/app/comps/button'

export function useMaxButton(
	max: string | undefined,
	control: Control,
): ButtonProps {
	const onClick = useCallback(() => {
		control.change(max)
	}, [max, control])

	return { onClick }
}
