import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/utils/misc'

const optionVariants = cva(undefined, {
	variants: {
		variant: {
			checked: 'size-2 rounded-full bg-gray-50 transition-all opacity-100',
			unchecked:
				'size-2 rounded-full bg-gray-50 transition-all opacity-0 group-hover:opacity-30',
		},
	},
})

export interface OptionProps
	extends React.ButtonHTMLAttributes<HTMLDivElement>,
		VariantProps<typeof optionVariants> {}

const Option = React.forwardRef<HTMLDivElement, OptionProps>(
	({ className, variant, ...props }, ref) => {
		return (
			<div
				className={cn(optionVariants({ variant, className }))}
				ref={ref}
				{...props}
			/>
		)
	},
)

Option.displayName = 'Option'

export { Option, optionVariants }
