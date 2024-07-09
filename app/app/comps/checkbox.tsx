import * as React from 'react'
import { useInputControl, useField, type FieldName } from '@conform-to/react'
import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { type ElementRef } from 'react'
import { Icon } from './_icon'
import { Tooltip, Content } from '@/app/comps/tooltip'

export interface CheckboxProps extends RadixCheckbox.CheckboxProps {
	name: FieldName<string>
}

const Checkbox = React.forwardRef<
	ElementRef<typeof RadixCheckbox.Root>,
	CheckboxProps
>(({ className, name, children, ...props }, ref) => {
	const [meta] = useField(name)
	const control = useInputControl(meta)

	return (
		<>
			<RadixCheckbox.Root
				ref={ref}
				id={meta.id}
				checked={control.value === 'on'}
				onCheckedChange={checked => {
					control.change(checked ? 'on' : '')
				}}
				onBlur={control.blur}
				className={className}
				{...props}
			>
				<RadixCheckbox.Indicator>
					{/* Add your custom indicator or icon here */}
					{children}
				</RadixCheckbox.Indicator>
			</RadixCheckbox.Root>
		</>
	)
})

Checkbox.displayName = 'Checkbox'

function ClmmCheckbox() {
	return (
		<Tooltip
			content={
				<Content
					className="data-[state=delayed-open]:animate-scale-in-50 data-[state=closed]:animate-scale-out-50 bg-gray-800 overflow-hidden bg-primary px-3 py-1.5 shadow-lg animate-in fade-in-0 gap-1 rounded-full text-xs text-gray-50"
					sideOffset={20}
					align="end"
					alignOffset={-12}
					side="top"
				>
					Create liquidity pool
				</Content>
			}
		>
			<Checkbox
				className="rounded-full border border-gray-200 w-5 h-5"
				name="clmm"
			>
				<Icon
					className="size-2.5 translate-y-[-2.5px] text-gray-100 transition-all"
					name="reset"
				/>
			</Checkbox>
		</Tooltip>
	)
}

export { Checkbox, ClmmCheckbox }
