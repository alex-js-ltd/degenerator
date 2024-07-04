'use client'

import React from 'react'
import * as SelectPrimitive from '@radix-ui/react-Select'
import classnames from 'classnames'
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from '@radix-ui/react-icons'

export function Select() {
	return (
		<SelectPrimitive.Root>
			<SelectPrimitive.Trigger
				className="inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-violet11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 outline-none"
				aria-label="Food"
			>
				<SelectPrimitive.Value placeholder="SelectPrimitive a fruit…" />
				<SelectPrimitive.Icon className="text-violet11">
					<ChevronDownIcon />
				</SelectPrimitive.Icon>
			</SelectPrimitive.Trigger>
			<SelectPrimitive.Portal>
				<SelectPrimitive.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
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

						<SelectPrimitive.Separator className="h-[1px] bg-violet6 m-[5px]" />

						<SelectPrimitive.Group>
							<SelectPrimitive.Label className="px-[25px] text-xs leading-[25px] text-mauve11">
								Vegetables
							</SelectPrimitive.Label>
							<SelectItem value="aubergine">Aubergine</SelectItem>
							<SelectItem value="broccoli">Broccoli</SelectItem>
							<SelectItem value="carrot" disabled>
								Carrot
							</SelectItem>
							<SelectItem value="courgette">Courgette</SelectItem>
							<SelectItem value="leek">Leek</SelectItem>
						</SelectPrimitive.Group>

						<SelectPrimitive.Separator className="h-[1px] bg-violet6 m-[5px]" />

						<SelectPrimitive.Group>
							<SelectPrimitive.Label className="px-[25px] text-xs leading-[25px] text-mauve11">
								Meat
							</SelectPrimitive.Label>
							<SelectItem value="beef">Beef</SelectItem>
							<SelectItem value="chicken">Chicken</SelectItem>
							<SelectItem value="lamb">Lamb</SelectItem>
							<SelectItem value="pork">Pork</SelectItem>
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
