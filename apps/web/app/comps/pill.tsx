import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/utils/misc'

const pillVariants = cva(undefined, {
	variants: {
		variant: {
			swap: 'w-fit shrink-0 inline-flex cursor-pointer items-center justify-between gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:pointer-events-none disabled:cursor-not-allowed bg-gray-100 text-gray-400 ring-0 has-[:focus-visible]:ring-2 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 border-gray-200 hover:bg-gray-100  h-8 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] rounded-lg',
		},
	},
})

export interface InputProps
	extends React.ComponentProps<'div'>,
		VariantProps<typeof pillVariants> {}

function Pill({ className, variant, ref, ...props }: InputProps) {
	return (
		<div
			className={cn(pillVariants({ variant, className }))}
			ref={ref} // `ref` is now a regular prop
			{...props}
		/>
	)
}

Pill.displayName = 'Pill'

export { Pill }
