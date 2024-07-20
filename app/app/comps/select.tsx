'use client'

import React, {
	type ReactNode,
	type ComponentType,
	type ElementRef,
	useRef,
} from 'react'
import * as RadixSelect from '@radix-ui/react-select'

import { ChevronDownIcon } from '@radix-ui/react-icons'

import {
	useInputControl,
	useField,
	useForm,
	type FieldName,
} from '@conform-to/react'
import { Option } from '@/app/comps/option'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/app/utils/misc'
import { Input } from '@/app/comps/input'
import { Icon } from './_icon'

interface SelectFieldProps {
	// You can use the `FieldMetadata` type to define the `meta` prop
	// And restrict the type of the field it accepts through its generics
	name: FieldName<string>
	items: SelectItemConfig[]
	children: ReactNode
	logo?: ComponentType<ImageProps>
	valueProps?: RadixSelect.SelectValueProps
	triggerProps?: RadixSelect.SelectTriggerProps
	contentProps?: RadixSelect.SelectContentProps
}

interface SelectItemProps
	extends React.ComponentPropsWithoutRef<typeof RadixSelect.Item> {
	fieldName: FieldName<string>
	title?: string
	imageProps?: ImageProps
}

interface CompoundSelect {
	name: FieldName<string>
	items: SelectItemConfig[]
}

export type SelectItemConfig = Omit<SelectItemProps, 'fieldName'>

function Select({
	name,
	items,
	valueProps,
	contentProps,
	logo: Component,
	children,
}: SelectFieldProps) {
	const [meta] = useField(name)
	const control = useInputControl(meta)

	const selectRef = useRef<ElementRef<typeof RadixSelect.Trigger>>(null)

	const border = meta.errors?.length ? 'border-teal-300' : 'border-gray-800'

	const selected = items.find(el => el.value === meta.value)

	const logoProps = selected?.imageProps

	return (
		<div className="relative flex-1">
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
			>
				<RadixSelect.Trigger
					ref={selectRef}
					className={cn(
						'disabled:pointer-events-none disabled:opacity-60 inline-flex h-[32px] w-full items-center gap-1.5 rounded-md bg-gray-800 hover:bg-gray-700/70 hover:text-gray-100 text-gray-400 text-sm px-2 transition-colors whitespace-nowrap focus:outline-none border',
						border,
					)}
				>
					{logoProps && Component && <Component {...logoProps} />}

					<RadixSelect.Value {...valueProps}>
						{selected?.title ?? ''}
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
						sideOffset={20}
						className="relative overflow-hidden bg-gray-900 rounded-md z-10 w-fit min-w-[124px] h-auto max-h-[136px] data-[state=open]:animate-scale-in-95 data-[state=closed]:animate-scale-out-50 "
						{...contentProps}
					>
						<RadixSelect.Viewport className="z-50">
							<RadixSelect.Group className="overflow-y-scroll flex h-full w-full flex-col overflow-hidden rounded-md bg-transparent text-gray-100 [&_[cmdk-input-wrapper]]:border-b-gray-800 p-1.5 gap-1">
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
		const variant = selected ? 'on' : 'off'

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

function TokenLogo({ src, alt }: ImageProps) {
	return (
		<div className="shrink-0 relative flex items-center overflow-hidden h-5 w-5 rounded pr-1">
			<Image
				className="relative aspect-[48/44] object-cover object-center rounded-lg"
				fill={true}
				src={src}
				alt={alt}
				sizes="1.25rem"
			/>
		</div>
	)
}

function FeeTierLogo({ src }: ImageProps) {
	if (typeof src === 'string') return <Icon className="w-full h-5" name={src} />
}

function QuoteToken({ name, items }: CompoundSelect) {
	return (
		<Select
			name={name}
			items={items}
			valueProps={{ placeholder: 'Quote Token' }}
			logo={TokenLogo}
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
					{item.imageProps ? <TokenLogo {...item.imageProps} /> : null}
				</SelectItem>
			))}
		</Select>
	)
}
function FeeTier({ name, items }: CompoundSelect) {
	return (
		<Select
			name={name}
			items={items}
			valueProps={{ placeholder: 'Fee Tier', children: null }}
			logo={FeeTierLogo}
		>
			{items.map(item => (
				<SelectItem
					value={item.value}
					id={`${name}-${item.value}`}
					key={item.value}
					fieldName={name}
				>
					<div className="flex items-center gap-2">
						<RadixSelect.ItemText className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-normal whitespace-nowrap">
							{item.children}
						</RadixSelect.ItemText>
					</div>
				</SelectItem>
			))}
		</Select>
	)
}

function InitialPrice({
	name,
	items: priceItems,
	quote,
}: CompoundSelect & { quote: SelectItemConfig[] }) {
	const [, fields] = useForm({})
	const [mint2] = useField(fields.mint2.name)
	const selected = quote.find(el => el.value === mint2.value)

	const items = priceItems.map(({ children, title, ...rest }) => ({
		...rest,
		children: selected?.title ? `${children} / ${selected.title}` : children,
		title: selected?.title ? `${title} / ${selected.title}` : title,
	}))

	return (
		<Select
			name={name}
			items={items}
			valueProps={{ placeholder: 'Initial Price' }}
		>
			{items.map(item => (
				<SelectItem
					value={item.value}
					id={`${name}-${item.value}`}
					key={item.value}
					fieldName={name}
				>
					<div className="flex items-center gap-2">
						<RadixSelect.ItemText className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-normal whitespace-nowrap">
							{item.children}
						</RadixSelect.ItemText>
					</div>
				</SelectItem>
			))}
		</Select>
	)
}

export { Select, SelectItem, QuoteToken, FeeTier, InitialPrice }
