'use client'

import { Input } from '@/app/comps/input'
import { useForm, useField, useInputControl } from '@conform-to/react'
import { type SelectItemConfig } from '@/app/comps/select'

export function InitialPrice({ items }: { items: SelectItemConfig[] }) {
	const [form, fields] = useForm({})

	const [symbol] = useField(fields.symbol.name)
	const [mint2] = useField(fields.mint2.name)

	const control = useInputControl(fields.initial.name)

	console.log(control.value)

	const selected = items.find(el => el.value === mint2.value)

	const pair =
		symbol.value && mint2.value
			? `${symbol.value} / ${selected?.title}`
			: undefined

	if (!pair || symbol.errors?.length) return null

	return (
		<div className="relative flex flex-1">
			<Input
				onChange={({ target: { value } }) => control.change(value)} // Access the value from the event
				disabled={!Boolean(pair)}
				placeholder={pair ?? 'Initial Price'}
				className="disabled:pointer-events-none disabled:opacity-60 inline-flex h-[32px] w-32 items-center gap-1.5 rounded-md bg-gray-800 hover:bg-gray-700/70 hover:text-gray-100 text-sm px-2 transition-colors whitespace-nowrap focus:outline-none border-0 pr-2 leading-relaxed text-white shadow-none outline-none ring-0 [scroll-padding-block:0.75rem] selection:bg-teal-300 selection:text-black placeholder:text-zinc-400"
			/>
		</div>
	)
}
