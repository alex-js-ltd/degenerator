'use client'

import { useEffect, useState } from 'react'
import { useField } from '@conform-to/react'
import { useFormStatus } from 'react-dom'
import { Button, type ButtonProps } from '@/app/comps/button'
import { useResetTx } from '@/app/context/tx_context'
import { Spinner } from '@/app/comps/spinner'
import { Icon } from './_icon'

export function SwapButton({ ...rest }: ButtonProps) {
	const { pending } = useFormStatus()

	const reset = useResetTx()

	const [{ valid, value }] = useField<number>('amount')

	const disabled =
		typeof value === 'undefined' ? true : valid && !pending ? false : true

	return (
		<Button variant="swap" disabled={disabled} type="submit" onClick={reset}>
			{pending ? <Spinner /> : <Icon name="swap" className="size-4" />}
		</Button>
	)
}
