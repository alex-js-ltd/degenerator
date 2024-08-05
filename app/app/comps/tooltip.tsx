'use client'
import React, { forwardRef } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

function Tooltip({ children, ...props }: TooltipPrimitive.TooltipProps) {
	return (
		<TooltipPrimitive.Provider>
			<TooltipPrimitive.Root delayDuration={100} {...props}>
				{children}
			</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	)
}

const TooltipTrigger = TooltipPrimitive.Trigger

interface TooltipContentProps
	extends React.ComponentProps<typeof TooltipPrimitive.Content> {
	children: React.ReactNode
}

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
	({ children, ...props }, forwardedRef) => (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content {...props} ref={forwardedRef}>
				{children}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	),
)

export { Tooltip, TooltipTrigger, TooltipContent }
