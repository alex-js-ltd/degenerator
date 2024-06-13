'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'

type TooltipProps = TooltipPrimitive.TooltipProps & { content: string }

export function Tooltip({ open, children, content }: TooltipProps) {
	return (
		<TooltipPrimitive.Provider>
			<TooltipPrimitive.Root delayDuration={100} open={open}>
				<TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
				<TooltipPrimitive.Portal>
					<TooltipPrimitive.Content
						className="z-50 bg-gray-900 shadow-lg  text-white data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade overflow-hidden rounded-md bg-primary px-[12px] h-[32px] text-sm flex items-center leading-none will-change-[transform,opacity]"
						sideOffset={18}
						align="end"
						alignOffset={-12}
						side="bottom"
					>
						{content}
					</TooltipPrimitive.Content>
				</TooltipPrimitive.Portal>
			</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	)
}
