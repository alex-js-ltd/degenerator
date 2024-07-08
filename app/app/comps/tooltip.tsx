'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { type ReactElement } from 'react'
import { cn } from '@/app/utils/misc'

type TooltipProps = {
	rootProps?: TooltipPrimitive.TooltipProps
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

// function Content({
// 	className,
// 	...props
// }: TooltipPrimitive.TooltipContentProps) {
// 	return (
// 		<TooltipPrimitive.Content
// 			className={cn(
// 				className,
// 				'data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade',
// 			)}
// 			{...props}
// 		/>
// 	)
// }

const Content = TooltipPrimitive.Content

export { Tooltip, Content }
