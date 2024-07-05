'use client'

import React from 'react'
import * as SelectPrimitive from '@radix-ui/react-Select'
import classnames from 'classnames'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'

import Image, { ImageProps } from 'next/image'

type SelectProps = {
	valueProps: SelectPrimitive.SelectValueProps
	triggerProps?: SelectPrimitive.SelectTriggerProps
	groupProps?: SelectPrimitive.SelectGroupProps
}

export function Select({ triggerProps, valueProps, groupProps }: SelectProps) {
	return (
		<SelectPrimitive.Root>
			<SelectPrimitive.Trigger
				className="disabled:pointer-events-none disabled:opacity-60 flex h-[32px] w-fit items-center gap-0.5 rounded-md bg-gray-800 hover:bg-gray-700/70 hover:text-gray-100 text-gray-400 text-sm px-2 transition-colors whitespace-nowrap focus:outline-none"
				{...triggerProps}
			>
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
					className="overflow-hidden bg-gray-900 rounded-md z-10 w-[300px] h-[200px] absolute top-0 "
				>
					<SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
						<ChevronUpIcon />
					</SelectPrimitive.ScrollUpButton>
					<SelectPrimitive.Viewport className="z-50">
						<SelectPrimitive.Group
							className="overflow-y-scroll flex h-full w-full flex-col overflow-hidden rounded-md bg-transparent text-gray-100 [&_[cmdk-input-wrapper]]:border-b-gray-800"
							{...groupProps}
						/>
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
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
	({ children, className, imageProps, ...props }, forwardedRef) => {
		return (
			<SelectPrimitive.Item
				className={classnames(
					'relative select-none outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 group flex w-full cursor-pointer items-center gap-1.5 rounded p-1 pl-2 text-sm text-gray-50 data-[selected=true]:bg-gray-800 data-[selected=true]:text-gray-50 bg-gray-800',
					className,
				)}
				{...props}
				ref={forwardedRef}
			>
				<div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-gray-500">
					<div className="size-2 rounded-full bg-gray-50 transition-all opacity-100" />
				</div>
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center gap-2">
						<SelectPrimitive.ItemText className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 max-w-[118px] truncate text-left align-middle font-normal whitespace-nowrap">
							{children}
						</SelectPrimitive.ItemText>
					</div>
					<div className="relative flex items-center overflow-hidden h-5 w-5 rounded">
						<Image
							className="relative aspect-[48/44] object-cover object-center rounded-lg"
							fill={true}
							{...imageProps}
						/>
					</div>
				</div>
			</SelectPrimitive.Item>
		)
	},
)
