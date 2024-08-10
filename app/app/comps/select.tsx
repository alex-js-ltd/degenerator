'use client'

import React, { type ReactNode, type ElementRef, useRef } from 'react'
import * as RadixSelect from '@radix-ui/react-select'

import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useInputControl, useField, type FieldName } from '@conform-to/react'
import { Option } from '@/app/comps/option'
import { type ImageProps, TokenLogo } from '@/app/comps/token_logo'
import { cn } from '@/app/utils/misc'
import { Input } from '@/app/comps/input'
import { usePool } from '@/app/context/pool_context'

interface SelectFieldProps {
	// You can use the `FieldMetadata` type to define the `meta` prop
	// And restrict the type of the field it accepts through its generics
	name: FieldName<string>
	items: SelectItemConfig[]
	children: ReactNode
	title?: string
	logo?: React.JSX.Element
	valueProps?: RadixSelect.SelectValueProps
	triggerProps?: RadixSelect.SelectTriggerProps
	contentProps?: RadixSelect.SelectContentProps
}

interface SelectItemProps
	extends React.ComponentPropsWithoutRef<typeof RadixSelect.Item> {
	fieldName: FieldName<string>
	title?: string
	image?: ImageProps
}

export type SelectItemConfig = Omit<SelectItemProps, 'fieldName'>

function Select({
	name,
	items,
	valueProps,
	contentProps,
	logo,
	title,
	children,
}: SelectFieldProps) {
	const [meta] = useField<string>(name)
	const control = useInputControl(meta)

	const selectRef = useRef<ElementRef<typeof RadixSelect.Trigger>>(null)

	const border = meta.errors?.length ? 'border-teal-300' : 'border-gray-800'

	return (
		<div className="relative w-28">
			<Input
				name={meta.name}
				defaultValue={meta.initialValue}
				className="sr-only"
				tabIndex={-1}
				onFocus={() => {
					selectRef.current?.focus()
				}}
			/>

			<RadixSelect.Root
				value={control.value ?? ''}
				onValueChange={control.change}
				onOpenChange={open => {
					if (!open) {
						control.blur()
					}
				}}
				disabled={items.length === 0}
			>
				<RadixSelect.Trigger
					ref={selectRef}
					className={cn(
						'disabled:pointer-events-none disabled:opacity-60 inline-flex h-[32px] w-full items-center gap-1.5 rounded-md bg-gray-800 hover:bg-gray-700/70 hover:text-gray-100 text-gray-400 text-sm px-2 transition-colors whitespace-nowrap focus:outline-none border',
						border,
					)}
				>
					{logo}

					<RadixSelect.Value {...valueProps}>
						{title ?? valueProps?.placeholder}
					</RadixSelect.Value>

					<RadixSelect.Icon className="text-violet11 ml-auto">
						<ChevronDownIcon />
					</RadixSelect.Icon>
				</RadixSelect.Trigger>
				<RadixSelect.Portal>
					<RadixSelect.Content
						sticky="always"
						position="popper"
						side="bottom"
						sideOffset={18}
						className="w-[calc(100vw-3rem-2px)] mr-[15px] sm:mr-0 relative overflow-hidden bg-gray-900 rounded-lg z-10 sm:w-[300px] h-auto max-h-[136px] data-[state=open]:animate-scale-in-95 data-[state=closed]:animate-scale-out-50"
						{...contentProps}
					>
						<RadixSelect.Viewport className="z-50">
							<RadixSelect.Group className="overflow-y-scroll flex h-full w-full flex-col overflow-hidden rounded-[10px] bg-transparent text-gray-100 [&_[cmdk-input-wrapper]]:border-b-gray-800 p-1.5 gap-1">
								{children}
							</RadixSelect.Group>
						</RadixSelect.Viewport>
					</RadixSelect.Content>
				</RadixSelect.Portal>
			</RadixSelect.Root>
		</div>
	)
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
	({ children, className, fieldName, ...props }, forwardedRef) => {
		const [meta] = useField(fieldName)
		const selected = meta.value === props.value
		const variant = selected ? 'checked' : 'unchecked'

		return (
			<RadixSelect.Item
				className={cn(
					'data-[state=checked]:bg-gray-800 relative select-none outline-none group flex w-full cursor-pointer items-center gap-1.5 rounded p-1 pl-2 text-sm text-gray-50 bg-gray-900 hover:bg-gray-800',
					className,
				)}
				{...props}
				ref={forwardedRef}
			>
				<div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-gray-500 group">
					<Option variant={variant} />
				</div>
				<div className="flex w-full items-center justify-between">
					{children}
				</div>
			</RadixSelect.Item>
		)
	},
)

function MintList({ name = 'mintB' }: { name?: 'mintB' }) {
	const { items, selected } = usePool()
	const { image, title } = selected

	return (
		<Select
			name={name}
			items={items}
			valueProps={{ placeholder: '🌿  Mint B' }}
			title={title}
			logo={image && <TokenLogo {...image} />}
		>
			{items.map(item => (
				<SelectItem
					value={item.value}
					id={`${name}-${item.value}`}
					key={item.value}
					fieldName={name}
				>
					<div className="flex items-center gap-2 pr-2">
						<RadixSelect.ItemText className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 max-w-[118px] truncate text-left align-middle font-normal whitespace-nowrap">
							{item.children}
						</RadixSelect.ItemText>
					</div>
					{item.image ? <TokenLogo {...item.image} /> : null}
				</SelectItem>
			))}
		</Select>
	)
}

export { Select, SelectItem, MintList }
