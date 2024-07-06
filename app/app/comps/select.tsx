'use client'

import React, {
	createContext,
	useContext,
	type ReactNode,
	type Dispatch,
	type SetStateAction,
} from 'react'
import * as RadixSelect from '@radix-ui/react-Select'
import classnames from 'classnames'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'

import { type FieldMetadata, useInputControl } from '@conform-to/react'
import { Checkbox } from '@/app/comps/check_box'
import Image, { ImageProps } from 'next/image'
import invariant from 'tiny-invariant'

export interface SelectFieldProps {
	// You can use the `FieldMetadata` type to define the `meta` prop
	// And restrict the type of the field it accepts through its generics
	meta: FieldMetadata<string>
	items: Array<SelectItemProps>
	children: ReactNode
}

type Control = {
	value: string | undefined
	change: Dispatch<SetStateAction<string | undefined>>
	focus: () => void
	blur: () => void
}
const SelectContext = createContext<
	| {
			imageProps?: ImageProps
			control: Control
			items: SelectItemProps[]
			meta: FieldMetadata<string>
	  }
	| undefined
>(undefined)

function SelectProvider({ children, meta, items }: SelectFieldProps) {
	const control = useInputControl(meta)

	const imageProps = items.find(el => el.value === control.value)?.imageProps

	const value = { imageProps, control, items, meta }

	return (
		<SelectContext.Provider value={value}>{children}</SelectContext.Provider>
	)
}

function useSelect() {
	const context = useContext(SelectContext)

	invariant(context, 'useSelect must be used within a SelectProvider')
	return context
}

function Select({
	children,
	placeholder,
}: {
	children: ReactNode
	placeholder: string
}) {
	const { control, meta } = useSelect()

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
			<RadixSelect.Trigger className="disabled:pointer-events-none disabled:opacity-60 inline-flex h-[32px] w-[124px] items-center gap-1.5 rounded-md bg-gray-800 hover:bg-gray-700/70 hover:text-gray-100 text-gray-400 text-sm px-2 transition-colors whitespace-nowrap focus:outline-none">
				<Logo />

				<RadixSelect.Value placeholder={placeholder} />
				<RadixSelect.Icon className="text-violet11 ml-auto">
					<ChevronDownIcon />
				</RadixSelect.Icon>
			</RadixSelect.Trigger>
			<RadixSelect.Portal>
				<RadixSelect.Content
					position="popper"
					side="bottom"
					sideOffset={20}
					className="overflow-hidden bg-gray-900 rounded-md z-10 w-fit min-w-[124px] h-[200px] absolute top-0"
				>
					<RadixSelect.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
						<ChevronUpIcon />
					</RadixSelect.ScrollUpButton>
					<RadixSelect.Viewport className="z-50">
						<RadixSelect.Group className="overflow-y-scroll flex h-full w-full flex-col overflow-hidden rounded-md bg-transparent text-gray-100 [&_[cmdk-input-wrapper]]:border-b-gray-800 p-1.5 gap-1">
							{children}
						</RadixSelect.Group>
					</RadixSelect.Viewport>
					<RadixSelect.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
						<ChevronDownIcon />
					</RadixSelect.ScrollDownButton>
				</RadixSelect.Content>
			</RadixSelect.Portal>
		</RadixSelect.Root>
	)
}

interface SelectItemProps
	extends React.ComponentPropsWithoutRef<typeof RadixSelect.Item> {
	imageProps: ImageProps
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
	({ children, className, ...props }, forwardedRef) => {
		const { control } = useSelect()
		const selected = control.value === props.value
		const variant = selected ? 'on' : 'off'
		return (
			<RadixSelect.Item
				className={classnames(
					'relative select-none outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 group flex w-full cursor-pointer items-center gap-1.5 rounded p-1 pl-2 text-sm text-gray-50  bg-gray-900 hover:bg-gray-800',
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

function SelectItems() {
	const { items } = useSelect()

	return (
		<>
			{items.map(({ children, ...props }) => (
				<SelectItem key={props.value} {...props}>
					<div className="flex items-center gap-2">
						<RadixSelect.ItemText className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 max-w-[118px] truncate text-left align-middle font-normal whitespace-nowrap">
							{children}
						</RadixSelect.ItemText>
					</div>

					<div className="relative flex items-center overflow-hidden h-5 w-5 rounded pr-1">
						<Image
							className="relative aspect-[48/44] object-cover object-center rounded-lg"
							fill={true}
							src={props.imageProps.src}
							alt={props.imageProps.alt}
							sizes="1.25rem"
						/>
					</div>
				</SelectItem>
			))}
		</>
	)
}

function Logo() {
	const { imageProps } = useSelect()

	if (!imageProps) return null
	return (
		<div className="relative flex items-center overflow-hidden h-5 w-5 rounded pr-1">
			<Image
				className="relative aspect-[48/44] object-cover object-center rounded-lg"
				fill={true}
				sizes="1.25rem"
				{...imageProps}
			/>
		</div>
	)
}

export { SelectProvider, Select, SelectItems }
