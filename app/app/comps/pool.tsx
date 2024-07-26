'use client'

import { type SelectItemConfig } from '@/app/comps/select'
import { useField, useInputControl } from '@conform-to/react'
import { Popover, Content } from '@/app/comps/popover'
import { Button } from '@/app/comps/button'
import { Input } from '@/app/comps/input'
import { Icon } from '@/app/comps/_icon'

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
							value={a.value || ''}
							onChange={e => a.change(e.target.value)}
							onFocus={a.focus}
							onBlur={a.blur}
						/>
						<Input
							variant="pool"
							placeholder={mintBPlaceholder}
							value={b.value || ''}
							onChange={e => b.change(e.target.value)}
							onFocus={b.focus}
							onBlur={b.blur}
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
