'use client'

import React from 'react'
import * as SelectPrimitive from '@radix-ui/react-Select'
import classnames from 'classnames'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'

import { type FieldMetadata, useInputControl } from '@conform-to/react'
import { Checkbox } from '@/app/comps/check_box'
import Image, { ImageProps } from 'next/image'

export type SelectFieldProps = {
	// You can use the `FieldMetadata` type to define the `meta` prop
	// And restrict the type of the field it accepts through its generics
	meta: FieldMetadata<string>
	options: SelectItemProps[]
	valueProps: SelectPrimitive.SelectValueProps
}

export function Select({ meta, options, valueProps }: SelectFieldProps) {
	const control = useInputControl(meta)

	const imageProps = options.find(el => el.value === control.value)?.imageProps

	return (
		<SelectPrimitive.Root
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
			<SelectPrimitive.Trigger className="disabled:pointer-events-none disabled:opacity-60 flex h-[32px] w-fit items-center gap-0.5 rounded-md bg-gray-800 hover:bg-gray-700/70 hover:text-gray-100 text-gray-400 text-sm px-2 transition-colors whitespace-nowrap focus:outline-none">
				<Logo imageProps={imageProps} />

				<SelectPrimitive.Value {...valueProps} />
				<SelectPrimitive.Icon className="text-violet11 ml-auto">
					<ChevronDownIcon />
				</SelectPrimitive.Icon>
			</SelectPrimitive.Trigger>
			<SelectPrimitive.Portal>
				<SelectPrimitive.Content
					position="popper"
					side="bottom"
					sideOffset={20}
					className="overflow-hidden bg-gray-900 rounded-md z-10 w-[300px] h-[200px] absolute top-0"
				>
					<SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
						<ChevronUpIcon />
					</SelectPrimitive.ScrollUpButton>
					<SelectPrimitive.Viewport className="z-50">
						<SelectPrimitive.Group className="overflow-y-scroll flex h-full w-full flex-col overflow-hidden rounded-md bg-transparent text-gray-100 [&_[cmdk-input-wrapper]]:border-b-gray-800">
							{options.map(({ value, ...rest }) => (
								<SelectItem
									key={value}
									selectedValue={control.value}
									value={value}
									{...rest}
								/>
							))}
						</SelectPrimitive.Group>
					</SelectPrimitive.Viewport>
					<SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
						<ChevronDownIcon />
					</SelectPrimitive.ScrollDownButton>
				</SelectPrimitive.Content>
			</SelectPrimitive.Portal>
		</SelectPrimitive.Root>
	)
}

interface SelectItemProps
	extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
	imageProps: ImageProps
	selectedValue?: string
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
	(
		{ children, className, imageProps, selectedValue, ...props },
		forwardedRef,
	) => {
		const selected = selectedValue === props.value
		const variant = selected ? 'on' : 'off'
		return (
			<SelectPrimitive.Item
				className={classnames(
					'relative select-none outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 group flex w-full cursor-pointer items-center gap-1.5 rounded p-1 pl-2 text-sm text-gray-50 data-[selected=true]:bg-gray-800 data-[selected=true]:text-gray-50',
					className,
				)}
				{...props}
				ref={forwardedRef}
			>
				<div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-gray-500">
					<Checkbox variant={variant} />
				</div>
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center gap-2">
						<SelectPrimitive.ItemText className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 max-w-[118px] truncate text-left align-middle font-normal whitespace-nowrap">
							{children}
						</SelectPrimitive.ItemText>
					</div>
					<Logo imageProps={imageProps} />
				</div>
			</SelectPrimitive.Item>
		)
	},
)

function Logo({ imageProps }: { imageProps?: ImageProps }) {
	const className = Boolean(imageProps)
		? 'relative flex items-center overflow-hidden h-5 w-5 rounded'
		: 'relative flex items-center overflow-hidden h-5 w-5 rounded outline outline-1 outline-offset-[-1px] outline-white/[.14]'

	return (
		<div className={className}>
			{imageProps ? (
				<Image
					className="relative aspect-[48/44] object-cover object-center rounded-lg"
					fill={true}
					src={imageProps.src}
					alt={imageProps.alt}
				/>
			) : null}
		</div>
	)
}
