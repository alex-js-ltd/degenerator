'use client'

import { useField } from '@conform-to/react'
import { useFormStatus } from 'react-dom'
import { Button, type ButtonProps } from '@/app/comps/button'
import { useResetTx } from '@/app/context/tx_context'
import { Spinner } from '@/app/comps/spinner'
import { Icon } from './_icon'

export function SwapButton({ ...rest }: ButtonProps) {
	const { pending } = useFormStatus()

	const reset = useResetTx()

	const [{ errors }] = useField<string>('amount')

	const disabled = errors?.length ? true : false

	if (pending) {
		return (
			<div className="relative inline-flex shrink-0 w-8 h-8 items-center justify-center bg-gray-100 rounded-lg">
				<Spinner />
			</div>
		)
	}

	return (
		<button
			className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 has-[:focus-visible]:ring-2 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 disabled:border-gray-200 border-gray-900 bg-gray-900 text-white hover:border-gray-700 hover:bg-gray-700 focus:border-gray-700 focus:bg-gray-700 focus-visible:border-gray-700 focus-visible:bg-gray-700 h-8 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] rounded-lg"
			disabled={disabled}
			type="submit"
		>
			<Icon name="swap" className="size-4" />
		</button>
	)
}
