'use client'

import { useField, useInputControl, type FieldName } from '@conform-to/react'

import { usePayer } from '@/app/hooks/use_payer'
import { Button, type ButtonProps } from '@/app/comps/button'
import { callAll } from '@/app/utils/misc'
import { Icon } from './_icon'
import { Tooltip, Content } from '@/app/comps/tooltip'

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
		<Tooltip
			content={
				<Content
					className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade z-50 bg-gray-800 overflow-hidden bg-primary px-3 py-1.5 shadow-lg animate-in fade-in-0 zoom-in-95 gap-1 rounded-full text-xs text-gray-50"
					sideOffset={20}
					align="end"
					alignOffset={-12}
					side="top"
				>
					Mint Token
				</Content>
			}
		>
			<Button type="reset" onClick={callAll(onClick, reset)} {...props}>
				<Icon
					className="size-2.5 translate-y-[-2.5px] text-gray-100 transition-all"
					name="reset"
				/>
			</Button>
		</Tooltip>
	)
}
