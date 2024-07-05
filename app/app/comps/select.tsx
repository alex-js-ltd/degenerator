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
					className="overflow-hidden bg-gray-900 rounded-md z-10 w-[300px] h-[334px] absolute top-0 "
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

export const Token = ({ label }: { label: string }) => {
	return (
		<div
			className="relative select-none outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 group flex w-full cursor-pointer items-center gap-1.5 rounded p-1 pl-2 text-sm text-gray-50 data-[selected=true]:bg-gray-800 data-[selected=true]:text-gray-50 bg-gray-800"
			id=":rbn:"
			role="option"
			aria-disabled="false"
			aria-selected="true"
			data-disabled="false"
			data-selected="true"
			data-value="Default 0-0"
		>
			<div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-gray-500">
				<div className="size-2 rounded-full bg-gray-50 transition-all opacity-100"></div>
			</div>
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center gap-2">
					<label
						className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 max-w-[118px] truncate text-left align-middle font-normal"
						htmlFor="default-shadcn-Default"
					>
						{label}
					</label>
					<a href="/themes/default-shadcn">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="lucide lucide-pencil hidden size-3 animate-slideRightAndFade text-gray-400 opacity-0 transition-colors fill-mode-forwards hover:text-gray-50 group-hover:block"
							style={{ animationDelay: '150ms' }}
						>
							<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
							<path d="m15 5 4 4"></path>
						</svg>
					</a>
				</div>
				<div className="flex items-center overflow-hidden h-5 w-24 rounded outline outline-1 outline-offset-[-1px] outline-white/[.14]">
					<div className="relative h-full flex-1 bg-[--color]"></div>
					<div className="relative h-full flex-1 bg-[--color]"></div>
					<div className="relative h-full flex-1 bg-[--color]"></div>
					<div className="relative h-full flex-1 bg-[--color]"></div>
				</div>
			</div>
		</div>
	)
}
