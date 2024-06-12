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
						className="text-white bg-gray-900 translate-x-3 z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
						sideOffset={15}
						side="bottom"
						align="end"
					>
						{content}
					</TooltipPrimitive.Content>
				</TooltipPrimitive.Portal>
			</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	)
}
