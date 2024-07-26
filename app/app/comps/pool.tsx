'use client'

import { type SelectItemConfig } from '@/app/comps/select'
import { useField, useInputControl } from '@conform-to/react'
import { Popover, Content } from '@/app/comps/popover'
import { Button } from '@/app/comps/button'
import { Input, InputProps } from '@/app/comps/input'
import { Icon } from '@/app/comps/_icon'

type Control = ReturnType<typeof useInputControl<string>>

function getControlProps(control: Control): InputProps {
	return {
		value: control.value || '',
		onChange: e => control.change(e.target.value),
		onFocus: control.focus,
		onBlur: control.blur,
	}
}

function getErrorProps(errors?: string[]) {
	return {
		className: errors?.length ? 'border-teal-300' : undefined,
	}
}

export function Pool({ items }: { items: SelectItemConfig[] }) {
	const [symbol] = useField('symbol')
	const [mintB] = useField('mintB')

	const selected = items.find(el => el.value === mintB.value)

	const mintAPlaceholder = symbol.value
		? `Mint A amount (${symbol.value})`
		: 'Mint A amount'
	const mintBPlaceholder = selected?.title
		? `Mint B amount (${selected.title})`
		: 'Mint B amount'

	const [mintAAmount] = useField<string>('mintAAmount')
	const [mintBAmount] = useField<string>('mintBAmount')

	const a = useInputControl(mintAAmount)
	const b = useInputControl(mintBAmount)

	return (
		<Popover
			content={
				<Content
					side="bottom"
					align="start"
					alignOffset={0}
					sideOffset={20}
					className="w-full h-auto z-20 overflow-hidden rounded-lg border-gray-800 bg-gray-900 p-0"
				>
					<fieldset className="flex flex-col gap-2 p-2">
						<Input
							variant="pool"
							placeholder={mintAPlaceholder}
							{...getControlProps(a)}
							{...getErrorProps(mintAAmount.errors)}
						/>
						<Input
							variant="pool"
							placeholder={mintBPlaceholder}
							{...getControlProps(b)}
							{...getErrorProps(mintBAmount.errors)}
						/>
					</fieldset>
				</Content>
			}
		>
			<Button variant="pool">
				🏊‍♂️&nbsp;&nbsp;Pool
				<Icon className="size-[15px] ml-auto" name="arrow" />
			</Button>
		</Popover>
	)
}
