'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { type ReactElement } from 'react'

type TooltipProps = {
	rootProps: TooltipPrimitive.TooltipProps
	children: TooltipPrimitive.TooltipTriggerProps['children']
	content: ReactElement<TooltipPrimitive.TooltipContentProps>
}
function Tooltip({ rootProps, content, children }: TooltipProps) {
	return (
		<TooltipPrimitive.Provider>
			<TooltipPrimitive.Root delayDuration={100} {...rootProps}>
				<TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
				<TooltipPrimitive.Portal>{content}</TooltipPrimitive.Portal>
			</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	)
}
const Content = TooltipPrimitive.Content

export { Tooltip, Content }
