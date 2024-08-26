import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/utils/misc'

const buttonVariants = cva(undefined, {
	variants: {
		variant: {
			connect:
				'shrink-0 items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background font-medium hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs gap-[6px] rounded-full shadow-none sm:flex',
			submit:
				'shrink-0 whitespace-nowrap text-sm text-zinc-400 hover:text-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 flex items-center justify-center bg-transparent hover:bg-gray-800 focus-visible:bg-gray-800 focus-visible:ring-0 h-8 w-8 rounded-md',
			image:
				'w-28 shrink-0 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 items-center justify-center bg-transparent focus-visible:bg-gray-800 focus-visible:ring-0 h-8 py-2 flex select-none gap-2 text-white/70 focus-within:bg-gray-700 sm:px-3 cursor-pointer relative  hover:border-gray-800 bg-gray-800 hover:bg-gray-700/70 hover:text-gray-100 text-gray-400 px-2 focus:outline-none border border-gray-800',
			pool: 'w-28 shrink-0 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 items-center justify-center bg-transparent focus-visible:bg-gray-800 focus-visible:ring-0 h-8 py-2 flex select-none gap-2 text-white/70 focus-within:bg-gray-700 sm:px-3 cursor-pointer relative  hover:border-gray-800 bg-gray-800 hover:bg-gray-700/70 hover:text-gray-100 text-gray-400 px-2 focus:outline-none border border-gray-800',
			reset:
				'rounded-full border border-gray-200 w-5 h-5 opacity-50 transition-opacity hover:opacity-80 flex items-center justify-center',
			tab: 'inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full px-3 text-sm font-medium text-gray-500 ring-offset-white transition-all hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-100 data-[state=active]:text-[#171717]',
		},
	},
})

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button'
		return (
			<Comp
				className={cn(buttonVariants({ variant, className }))}
				ref={ref}
				{...props}
			/>
		)
	},
)
Button.displayName = 'Button'

export { Button, buttonVariants }
