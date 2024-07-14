import { useField, useInputControl, type FieldName } from '@conform-to/react'
import { usePayer } from '@/app/hooks/use_payer'
const name: FieldName<string> = 'payerKey'

export function useResetForm() {
	const [meta, form] = useField(name)
	const control = useInputControl(meta)
	const payer = usePayer()

	const reset = () => {
		form.reset()
		control.value = payer
	}

	return reset
}
