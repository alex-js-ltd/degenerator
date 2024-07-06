'use client'

import React, { type ReactElement, cloneElement } from 'react'
import * as RadixSelect from '@radix-ui/react-Select'
import classnames from 'classnames'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'

import { type FieldMetadata, useInputControl } from '@conform-to/react'
import { Checkbox } from '@/app/comps/check_box'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/app/utils/misc'

export interface SelectFieldProps {
	// You can use the `FieldMetadata` type to define the `meta` prop
	// And restrict the type of the field it accepts through its generics
	meta: FieldMetadata<string>
	items: Array<SelectItemProps>
	children: ReactElement[]
	valueProps?: RadixSelect.SelectValueProps
	triggerProps?: RadixSelect.SelectTriggerProps
	contentProps?: RadixSelect.SelectContentProps
}

function Select({
	meta,
	items,
	valueProps,
	contentProps,
	children,
}: SelectFieldProps) {
	const control = useInputControl(meta)

	const imageProps = items.find(el => el.value === control.value)?.imageProps

	return (
		<RadixSelect.Root
			required
			name={meta.name}
			value={control.value}
			onValueChange={value => {
				control.change(value)
			}}
			onOpenChange={open => {
				if (!open) {
					control.blur()
				}
			}}
		>
			<RadixSelect.Trigger className="disabled:pointer-events-none disabled:opacity-60 inline-flex h-[32px] w-fit items-center gap-1.5 rounded-md bg-gray-800 hover:bg-gray-700/70 hover:text-gray-100 text-gray-400 text-sm px-2 transition-colors whitespace-nowrap focus:outline-none">
				{imageProps ? <Logo {...imageProps} /> : null}

				<RadixSelect.Value {...valueProps} />
				<RadixSelect.Icon className="text-violet11 ml-auto">
					<ChevronDownIcon />
				</RadixSelect.Icon>
			</RadixSelect.Trigger>
			<RadixSelect.Portal>
				<RadixSelect.Content
					position="popper"
					side="bottom"
					sideOffset={20}
					className="overflow-hidden bg-gray-900 rounded-md z-10 w-fit min-w-[124px] h-auto max-h-[136px]"
					{...contentProps}
				>
					<RadixSelect.Viewport className="z-50">
						<RadixSelect.Group className="overflow-y-scroll flex h-full w-full flex-col overflow-hidden rounded-md bg-transparent text-gray-100 [&_[cmdk-input-wrapper]]:border-b-gray-800 p-1.5 gap-1">
							{React.Children.map(children, c =>
								cloneElement(c, { selectedValue: control.value }),
							)}
						</RadixSelect.Group>
					</RadixSelect.Viewport>
				</RadixSelect.Content>
			</RadixSelect.Portal>
		</RadixSelect.Root>
	)
}

interface SelectItemProps
	extends React.ComponentPropsWithoutRef<typeof RadixSelect.Item> {
	selectedValue?: string
	imageProps?: ImageProps
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
	({ children, className, selectedValue, ...props }, forwardedRef) => {
		const selected = selectedValue === props.value
		const variant = selected ? 'on' : 'off'
		return (
			<RadixSelect.Item
				className={classnames(
					'relative select-none outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 group flex w-full cursor-pointer items-center gap-1.5 rounded p-1 pl-2 text-sm text-gray-50 bg-gray-900 hover:bg-gray-800',
					className,
				)}
				{...props}
				ref={forwardedRef}
			>
				<div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-gray-500 group">
					<Checkbox variant={variant} />
				</div>
				<div className="flex w-full items-center justify-between">
					{children}
				</div>
			</RadixSelect.Item>
		)
	},
)

function Logo({ className, src, alt }: ImageProps) {
	return (
		<div
			className={cn(
				'relative flex items-center overflow-hidden h-5 w-5 rounded pr-1',
				className,
			)}
		>
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

interface CompoundSelect {
	meta: FieldMetadata<string>
	items: Array<SelectItemProps>
}

function QuoteToken({ meta, items }: CompoundSelect) {
	return (
		<Select
			meta={meta}
			items={items}
			valueProps={{ placeholder: 'Quote Token' }}
		>
			{items.map(({ children, imageProps, ...props }) => (
				<SelectItem key={props.value} {...props}>
					<div className="flex items-center gap-2">
						<RadixSelect.ItemText className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 max-w-[118px] truncate text-left align-middle font-normal whitespace-nowrap">
							{children}
						</RadixSelect.ItemText>
					</div>
					{imageProps ? <Logo {...imageProps} /> : null}
				</SelectItem>
			))}
		</Select>
	)
}
function FeeTier({ meta, items }: CompoundSelect) {
	return (
		<Select meta={meta} items={items} valueProps={{ placeholder: 'Fee Tier' }}>
			{items.map(({ children, imageProps, ...props }) => (
				<SelectItem key={props.value} {...props}>
					<div className="flex items-center gap-2">
						<RadixSelect.ItemText className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-normal whitespace-nowrap">
							{children}
						</RadixSelect.ItemText>
					</div>
					{/* {imageProps ? (
						<div className="relative flex items-center overflow-hidden h-5 w-24 rounded border border-gs-gray-alpha-400">
							<Image
								className="relative aspect-[48/44] object-cover object-center rounded-lg"
								fill={true}
								src="/stable_pairs.svg"
								alt="hello"
							/>
						</div>
					) : null} */}
				</SelectItem>
			))}
		</Select>
	)
}
export { Select, SelectItem, QuoteToken, FeeTier }
