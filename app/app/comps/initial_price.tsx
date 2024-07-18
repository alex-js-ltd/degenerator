'use client'

import { Input } from '@/app/comps/input'
import { useForm, useField, getInputProps } from '@conform-to/react'
import { type SelectItemConfig } from '@/app/comps/select'

export function InitialPrice({ items }: { items: SelectItemConfig[] }) {
	const [, fields] = useForm({})

	const [symbol] = useField(fields.symbol.name)
	const [mint2] = useField(fields.mint2.name)
	const [initialPrice] = useField(fields.initialPrice.name)

	const selected = items.find(el => el.value === mint2.value)
	const pair =
		symbol.value && mint2.value
			? `${symbol.value} / ${selected?.title}`
			: undefined
	const disabled = !!(!pair || symbol.errors?.length)

	const error = initialPrice.errors?.length ? 'border-teal-300' : undefined

	return (
		<Input
			{...getInputProps(initialPrice, { type: 'text' })}
			disabled={disabled}
			placeholder={disabled ? 'Initial Price' : pair}
			variant="price"
			className={error}
		/>
	)
}
