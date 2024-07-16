'use client'

import { Input } from '@/app/comps/input'
import { useField } from '@conform-to/react'
import { type SelectItemConfig } from '@/app/comps/select'

export function InitialPrice({ items }: { items: SelectItemConfig[] }) {
	const [symbol] = useField('symbol')
	const [mint2] = useField('mint2')

	const selected = items.find(el => el.value === mint2.value)

	const pair =
		symbol.value && mint2.value
			? `${symbol.value} / ${selected?.title}`
			: undefined

	if (!pair) return

	return (
		<div className="relative flex flex-1">
			<Input
				placeholder={pair}
				className="disabled:pointer-events-none disabled:opacity-60 inline-flex h-[32px] w-32 items-center gap-1.5 rounded-md bg-gray-800 hover:bg-gray-700/70 hover:text-gray-100 text-gray-400 text-sm px-2 transition-colors whitespace-nowrap focus:outline-none border"
			/>
		</div>
	)
}
