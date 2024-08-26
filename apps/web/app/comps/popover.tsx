import React, { forwardRef } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

interface PopoverContentProps
	extends React.ComponentProps<typeof PopoverPrimitive.Content> {
	children: React.ReactNode
}

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
	({ children, ...props }, forwardedRef) => (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content {...props} ref={forwardedRef}>
				{children}
			</PopoverPrimitive.Content>
		</PopoverPrimitive.Portal>
	),
)

export { Popover, PopoverTrigger, PopoverContent }
