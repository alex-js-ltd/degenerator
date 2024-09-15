import * as RadixSwitch from '@radix-ui/react-switch'
import { type FieldMetadata, useInputControl } from '@conform-to/react'
import { type ElementRef, useRef } from 'react'

export function SwapSwitch({ meta }: { meta: FieldMetadata<boolean> }) {
	const switchRef = useRef<ElementRef<typeof RadixSwitch.Root>>(null)
	const control = useInputControl(meta)

	return (
		<>
			<input
				name={meta.name}
				defaultValue={meta.initialValue}
				className="sr-only"
				tabIndex={-1}
				onFocus={() => {
					switchRef.current?.focus()
				}}
			/>
			<RadixSwitch.Root
				ref={switchRef}
				id={meta.id}
				checked={meta.value === 'on'}
				onCheckedChange={checked => {
					control.change(checked ? 'on' : '')
				}}
				onBlur={control.blur}
				className="relative w-24 shrink-0 inline-flex cursor-pointer items-center justify-between gap-1.5 border font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:pointer-events-none disabled:cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-100 h-8 text-sm rounded-lg"
			>
				<div className="absolute left-3 z-50 text-sm font-medium">Buy</div>
				<div className="absolute right-3 z-50 text-sm font-medium">Sell</div>
				<RadixSwitch.Thumb className="block w-12 h-[30px] bg-gray-200/70 rounded-[7px]  transition-transform duration-100 transform translate-x-0 data-[state=unchecked]:translate-x-[46px]" />
			</RadixSwitch.Root>
		</>
	)
}
