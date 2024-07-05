import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/utils/misc'

const checkBoxVariants = cva(undefined, {
	variants: {
		variant: {
			on: 'size-2 rounded-full bg-gray-50 transition-all opacity-100',
			off: 'size-2 rounded-full bg-gray-50 transition-all opacity-0 [[data-selected=true]_&]:opacity-30',
		},
	},
})

export interface CheckboxProps
	extends React.ButtonHTMLAttributes<HTMLDivElement>,
		VariantProps<typeof checkBoxVariants> {}

const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
	({ className, variant, ...props }, ref) => {
		return (
			<div
				className={cn(checkBoxVariants({ variant, className }))}
				ref={ref}
				{...props}
			/>
		)
	},
)

Checkbox.displayName = 'Checkbox'

export { Checkbox, checkBoxVariants }
