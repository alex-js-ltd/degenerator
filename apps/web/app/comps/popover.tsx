import React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

interface PopoverContentProps
	extends React.ComponentProps<typeof PopoverPrimitive.Content> {
	children: React.ReactNode
}

function PopoverContent({ children, ref, ...props }: PopoverContentProps) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content {...props} ref={ref}>
				{children}
			</PopoverPrimitive.Content>
		</PopoverPrimitive.Portal>
	)
}

export { Popover, PopoverTrigger, PopoverContent }
