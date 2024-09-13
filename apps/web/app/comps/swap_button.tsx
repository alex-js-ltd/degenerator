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
		<button
			className="inline-flex relative shrink-0 cursor-pointer items-center justify-center  whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 has-[:focus-visible]:ring-2 [&>svg]:pointer-events-none  disabled:border-gray-200 border-gray-900 bg-gray-900 text-white hover:border-gray-700 hover:bg-gray-700   h-8 w-8 text-sm   rounded-lg"
			disabled={disabled}
			type="submit"
			onClick={reset}
		>
			{pending ? <Spinner /> : <Icon name="swap" className="size-4" />}
		</button>
	)
}
