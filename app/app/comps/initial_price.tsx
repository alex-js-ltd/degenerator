'use client'

import { Input } from '@/app/comps/input'
import { useForm, useField, getInputProps } from '@conform-to/react'
import { type SelectItemConfig } from '@/app/comps/select'

export function InitialPrice({ items }: { items: SelectItemConfig[] }) {
	const [, fields] = useForm({})

	const [symbol] = useField(fields.symbol.name)
	const [mint2] = useField(fields.mint2.name)

	const selected = items.find(el => el.value === mint2.value)
	const pair =
		symbol.value && mint2.value
			? `${symbol.value} / ${selected?.title}`
			: undefined
	const disabled = !!(!pair || symbol.errors?.length)
	return (
		<div className="relative flex flex-1">
			<Input
				{...getInputProps(fields.initial, { type: 'text' })}
				disabled={disabled}
				placeholder={disabled ? 'Initial Price' : pair}
				className="disabled:pointer-events-none inline-flex h-[32px] w-32 items-center gap-1.5 rounded-md bg-gray-800 hover:bg-gray-700/70 hover:text-gray-100 text-sm px-2 transition-colors whitespace-nowrap focus:outline-none pr-2 leading-relaxed text-white shadow-none outline-none ring-0 [scroll-padding-block:0.75rem] selection:bg-teal-300 selection:text-black placeholder:text-zinc-400 disabled:border disabled:border-white disabled:border-opacity-[0.125] p-3"
			/>
		</div>
	)
}
