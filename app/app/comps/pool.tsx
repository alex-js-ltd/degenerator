'use client'

import { Popover, Content } from '@/app/comps/popover'
import { Button } from '@/app/comps/button'
import { Input, InputProps } from '@/app/comps/input'
import { Icon } from '@/app/comps/_icon'
import { type FieldName, useField, useInputControl } from '@conform-to/react'
import { type SelectItemConfig } from './select'

interface PoolContentProps {
	mintA: InputProps
	mintB: InputProps
}

interface Fields {
	symbol: FieldName<string>
	mintB: FieldName<string>
	mintAAmount: FieldName<string>
	mintBAmount: FieldName<string>
}

const fields: Fields = {
	symbol: 'symbol',
	mintB: 'mintB',
	mintAAmount: 'mintAAmount',
	mintBAmount: 'mintBAmount',
}

function PoolContent({ mintA, mintB }: PoolContentProps) {
	const [mintAMeta] = useField(fields.mintAAmount)
	const [mintBMeta] = useField(fields.mintBAmount)

	const controlMintA = useInputControl(mintAMeta)
	const controlMintB = useInputControl(mintBMeta)
	return (
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
					placeholder={mintA.placeholder}
					value={controlMintA.value || ''}
					onChange={e => controlMintA.change(e.target.value)}
					onFocus={controlMintA.focus}
					onBlur={controlMintA.blur}
				/>
				<Input
					variant="pool"
					placeholder={mintB.placeholder}
					value={controlMintB.value || ''}
					onChange={e => controlMintB.change(e.target.value)}
					onFocus={controlMintB.focus}
					onBlur={controlMintB.blur}
				/>
			</fieldset>
		</Content>
	)
}

export function Pool({ items }: { items: SelectItemConfig[] }) {
	const [symbol] = useField(fields.symbol)
	const [mintB] = useField(fields.mintB)

	const selected = items.find(el => el.value === mintB.value)

	const mintAPlaceholder = symbol.value
		? `Mint A amount (${symbol.value})`
		: 'Mint A amount'
	const mintBPlaceholder = selected?.title
		? `Mint B amount (${selected.title})`
		: 'Mint B amount'

	return (
		<Popover
			content={
				<PoolContent
					mintA={{
						placeholder: mintAPlaceholder,
					}}
					mintB={{
						placeholder: mintBPlaceholder,
					}}
				/>
			}
		>
			<Button variant="pool">
				🏊‍♂️&nbsp;&nbsp;Pool
				<Icon className="size-[15px] ml-auto" name="arrow" />
			</Button>
		</Popover>
	)
}
