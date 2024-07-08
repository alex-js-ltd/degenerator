'use client'

import { Button, type ButtonProps } from '@/app/comps/button'
import { Icon } from './_icon'
import { Tooltip, Content } from '@/app/comps/tooltip'

export function ClmmButton({ ...props }: ButtonProps) {
	return (
		<Tooltip
			content={
				<Content
					className="data-[state=delayed-open]:animate-scale-in-50 data-[state=closed]:animate-scale-out-50 bg-gray-800 overflow-hidden bg-primary px-3 py-1.5 shadow-lg animate-in fade-in-0 gap-1 rounded-full text-xs text-gray-50"
					sideOffset={20}
					align="end"
					alignOffset={-12}
					side="top"
				>
					<button onClick={props.onClick}>Create liquidity pool</button>
				</Content>
			}
		>
			<Button type="reset" {...props}>
				<Icon
					className="size-2.5 translate-y-[-2.5px] text-gray-100 transition-all"
					name="reset"
				/>
			</Button>
		</Tooltip>
	)
}
