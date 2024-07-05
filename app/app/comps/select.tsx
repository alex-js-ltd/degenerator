'use client'

import React from 'react'
import * as SelectPrimitive from '@radix-ui/react-Select'
import classnames from 'classnames'
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from '@radix-ui/react-icons'

type SelectProps = {
	valueProps: SelectPrimitive.SelectValueProps
	triggerProps?: SelectPrimitive.SelectTriggerProps
}

export function Select({ triggerProps, valueProps }: SelectProps) {
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
					className="overflow-hidden bg-gray-900 rounded-md z-10 w-[300px] "
				>
					<SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
						<ChevronUpIcon />
					</SelectPrimitive.ScrollUpButton>
					<SelectPrimitive.Viewport className="p-[5px]">
						<SelectPrimitive.Group>
							<SelectPrimitive.Label className="px-[25px] text-xs leading-[25px] text-mauve11">
								Fruits
							</SelectPrimitive.Label>
							<SelectItem value="apple">Apple</SelectItem>
							<SelectItem value="banana">Banana</SelectItem>
							<SelectItem value="blueberry">Blueberry</SelectItem>
							<SelectItem value="grapes">Grapes</SelectItem>
							<SelectItem value="pineapple">Pineapple</SelectItem>
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
	extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
	({ children, className, ...props }, forwardedRef) => {
		return (
			<SelectPrimitive.Item
				className={classnames(
					'text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1',
					className,
				)}
				{...props}
				ref={forwardedRef}
			>
				<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
				<SelectPrimitive.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
					<CheckIcon />
				</SelectPrimitive.ItemIndicator>
			</SelectPrimitive.Item>
		)
	},
)
