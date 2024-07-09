import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/utils/misc'

const OptionVariants = cva(undefined, {
	variants: {
		variant: {
			on: 'size-2 rounded-full bg-gray-50 transition-all opacity-100',
			off: 'size-2 rounded-full bg-gray-50 transition-all opacity-0 group-hover:opacity-30',
		},
	},
})

export interface OptionProps
	extends React.ButtonHTMLAttributes<HTMLDivElement>,
		VariantProps<typeof OptionVariants> {}

const Option = React.forwardRef<HTMLDivElement, OptionProps>(
	({ className, variant, ...props }, ref) => {
		return (
			<div
				className={cn(OptionVariants({ variant, className }))}
				ref={ref}
				{...props}
			/>
		)
	},
)

Option.displayName = 'Option'

export { Option, OptionVariants }
