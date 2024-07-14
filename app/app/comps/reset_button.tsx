'use client'
import React from 'react'
import { useResetForm } from '@/app/hooks/use_reset_form'
import { useFormStatus } from 'react-dom'
import { Button, type ButtonProps } from './button'
import { Icon } from './_icon'
import { callAll, cn } from '@/app/utils/misc'
import { useState } from 'react'
import { delay } from '@/app/utils/misc'

export function ResetButton({
	onClick,
	isLoading,
}: ButtonProps & { isLoading?: boolean }) {
	const reset = useResetForm()

	const { pending } = useFormStatus()
	const disabled = pending || isLoading ? true : false
	const [on, setOn] = useState(false)

	const animate = on ? 'animate-spin-fast' : undefined

	const toggle = async () => {
		if (on) return
		setOn(true)
		await delay(400)
		setOn(false)
	}

	return (
		<Button
			variant="reset"
			disabled={disabled}
			onClick={callAll(onClick, reset, toggle)}
		>
			<Icon
				name="reset"
				className={cn('size-2.5 text-gray-100 transition-all', animate)}
			/>
		</Button>
	)
}
