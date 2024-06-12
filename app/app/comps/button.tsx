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
				'shrink-0 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 items-center justify-center bg-transparent hover:bg-gray-800 focus-visible:bg-gray-800 focus-visible:ring-0 h-8 py-2 flex select-none gap-2 px-2 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3 cursor-pointer relative',
			toggle:
				'flex items-center gap-1.5 focus-within:bg-gray-70 shrink-0 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 items-center justify-center bg-transparent hover:bg-gray-800 focus-visible:bg-gray-800 focus-visible:ring-0 h-8 py-2 flex w-fit select-none gap-2 px-2 text-white/70 hover:text-white sm:w-fit sm:px-3',
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
