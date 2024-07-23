'use client'

import { useResetForm } from '@/app/hooks/use_reset_form'
import { Button, type ButtonProps } from './button'
import { Icon } from './_icon'
import { callAll, cn } from '@/app/utils/misc'
import { useState } from 'react'
import { delay } from '@/app/utils/misc'
import { Tooltip, Content } from '@/app/comps/tooltip'
import { useTxStatus, useResetTx } from '@/app/context/tx_context'

export function ResetButton({ onClick }: ButtonProps) {
	const resetForm = useResetForm()
	const resetTx = useResetTx()

	const { isLoading } = useTxStatus()
	const [on, setOn] = useState(false)

	const animate = on ? 'animate-spin-fast' : undefined

	async function toggle() {
		if (on) return
		setOn(true)
		await delay(400)
		setOn(false)
	}

	return (
		<Tooltip
			content={
				<Content
					className="data-[state=delayed-open]:animate-scale-in-50 data-[state=closed]:animate-scale-out-50 bg-gray-800 overflow-hidden px-3 py-1.5 shadow-lg animate-in fade-in-0 gap-1 rounded-full text-xs text-gray-50"
					sideOffset={20}
					align="end"
					alignOffset={-12}
					side="top"
				>
					Reset
				</Content>
			}
		>
			<Button
				variant="reset"
				disabled={isLoading}
				onClick={callAll(onClick, resetForm, toggle, resetTx)}
			>
				<Icon
					name="reset"
					className={cn('size-2.5 text-gray-100 transition-all', animate)}
				/>
			</Button>
		</Tooltip>
	)
}
