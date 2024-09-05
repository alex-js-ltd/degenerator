'use client'
import React from 'react'
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

function TooltipContent({ children, ref, ...props }: TooltipContentProps) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content ref={ref} {...props}>
				{children}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	)
}

export { Tooltip, TooltipTrigger, TooltipContent }
