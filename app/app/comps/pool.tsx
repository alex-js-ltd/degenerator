'use client'

import { Popover, Content } from '@/app/comps/popover'
import { Button } from '@/app/comps/button'
import { Input } from '@/app/comps/input'
import { Icon } from '@/app/comps/_icon'

import { useForm, useField } from '@conform-to/react'

import { type SelectItemConfig } from './select'

interface PoolContentProps {
	mintAPlaceholder: string
	mintBPlaceholder: string
}

function PoolContent({ mintAPlaceholder, mintBPlaceholder }: PoolContentProps) {
	return (
		<Content
			side="bottom"
			align="start"
			alignOffset={0}
			sideOffset={20}
			className="w-full h-auto z-20 overflow-hidden rounded-lg border-gray-800 bg-gray-900 p-0"
		>
			<fieldset className="flex flex-col gap-2 p-2">
				<Input name="mintA" placeholder={mintAPlaceholder} variant="pool" />
				<Input name="mintB" placeholder={mintBPlaceholder} variant="pool" />
			</fieldset>
		</Content>
	)
}

export function Pool({ items }: { items: SelectItemConfig[] }) {
	const [, fields] = useForm({})
	const [symbol] = useField(fields.symbol.name)
	const [mintB] = useField(fields.mintB.name)

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
					mintAPlaceholder={mintAPlaceholder}
					mintBPlaceholder={mintBPlaceholder}
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
