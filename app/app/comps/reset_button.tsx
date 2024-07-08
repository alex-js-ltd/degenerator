'use client'

import { useField, useInputControl, type FieldName } from '@conform-to/react'

import { usePayer } from '@/app/hooks/use_payer'
import { Button, type ButtonProps } from '@/app/comps/button'
import { callAll } from '@/app/utils/misc'
import { Icon } from './_icon'

const name: FieldName<string> = 'payerKey'

export function ResetButton({ onClick, ...props }: ButtonProps) {
	const [meta, form] = useField(name)
	const control = useInputControl(meta)
	const payer = usePayer()

	const reset = () => {
		form.reset()
		control.value = payer
	}

	return (
		<Button type="reset" onClick={callAll(onClick, reset)} {...props}>
			<Icon
				className="size-2.5 translate-y-[-2.5px] text-gray-100 transition-all"
				name="reset"
			/>
		</Button>
	)
}
