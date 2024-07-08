import { useField, useInputControl, type FieldName } from '@conform-to/react'

import { usePayer } from '@/app/hooks/use_payer'
import { type ButtonProps } from '@/app/comps/button'
import { callAll } from '@/app/utils/misc'

const name: FieldName<string> = 'payerKey'

export function useResetForm() {
	const [meta, form] = useField(name)
	const control = useInputControl(meta)
	const payer = usePayer()

	const reset = () => {
		form.reset()
		control.value = payer
	}

	function getButtonProps({ onClick, ...props }: ButtonProps) {
		return { onClick: callAll(onClick, reset), ...props }
	}

	return getButtonProps
}
