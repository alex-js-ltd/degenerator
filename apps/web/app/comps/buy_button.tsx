'use client'
import { useEffect, useRef } from 'react'
import { useField } from '@conform-to/react'
import { useFormStatus } from 'react-dom'
import { Button, type ButtonProps } from '@/app/comps/button'
import { useResetTx } from '@/app/context/tx_context'
import { useIsFirstRender } from '@/app/hooks/use_is_first_render'

export function BuyButton({ ...rest }: ButtonProps) {
	const { pending } = useFormStatus()

	const reset = useResetTx()

	const [{ errors }] = useField<string>('amount')

	const isFirstRender = useIsFirstRender()

	const disabled = errors?.length || isFirstRender || pending ? true : false

	return (
		<Button
			className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 has-[:focus-visible]:ring-2 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0  border-gray-900 bg-gray-900 text-white hover:border-gray-700 hover:bg-gray-700  h-8 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] rounded-lg"
			type="submit"
			disabled={disabled}
			onClick={reset}
		>
			<svg
				data-testid="geist-icon"
				height="16"
				strokeLinejoin="round"
				viewBox="0 0 16 16"
				width="16"
				style={{ color: 'currentcolor' }}
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M8.70711 1.39644C8.31659 1.00592 7.68342 1.00592 7.2929 1.39644L2.21968 6.46966L1.68935 6.99999L2.75001 8.06065L3.28034 7.53032L7.25001 3.56065V14.25V15H8.75001V14.25V3.56065L12.7197 7.53032L13.25 8.06065L14.3107 6.99999L13.7803 6.46966L8.70711 1.39644Z"
					fill="currentColor"
				></path>
			</svg>
			<span className="sr-only">Send Message</span>
		</Button>
	)
}
