import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/utils/misc'

const inputVariants = cva(undefined, {
	variants: {
		variant: {
			default:
				'min-h-[1.5rem] w-full flex-[1_0_50%] resize-none border-0 bg-gray-900 pr-2 text-sm leading-relaxed text-white shadow-none outline-none ring-0 [scroll-padding-block:0.75rem] selection:bg-teal-300 selection:text-black placeholder:text-zinc-400 disabled:bg-transparent disabled:opacity-80 [&amp;_textarea]:px-0',
			pool: 'disabled:pointer-events-none inline-flex h-[28px] w-fit items-center gap-1.5 rounded-md bg-gray-800 hover:bg-gray-700/70 hover:text-gray-100 text-sm px-2 transition-colors whitespace-nowrap focus:outline-none pr-2 leading-relaxed text-white shadow-none outline-none ring-0 [scroll-padding-block:0.75rem] selection:bg-teal-300 selection:text-black placeholder:text-zinc-400 border border-gray-800 disabled:bg-gray-900 disabled:border disabled:border-white disabled:border-opacity-[0.125] p-3',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, variant, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(inputVariants({ variant, className }))}
				ref={ref}
				{...props}
			/>
		)
	},
)

Input.displayName = 'Input'

export { Input }
