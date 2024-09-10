'use client'

import { useFormStatus } from 'react-dom'
import { Button, type ButtonProps } from '@/app/comps/button'
import { useResetTx } from '@/app/context/tx_context'

export function BuyButton({ ...rest }: ButtonProps) {
	const { pending } = useFormStatus()

	const reset = useResetTx()

	return (
		<Button
			{...rest}
			variant="buy"
			type="submit"
			disabled={pending}
			onClick={reset}
			aria-label={`Buy`}
		>
			<svg
				height={16}
				strokeLinejoin="round"
				viewBox="0 0 16 16"
				width={16}
				style={{ color: 'currentColor' }}
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M8.70711 1.39644C8.31659 1.00592 7.68342 1.00592 7.2929 1.39644L2.21968 6.46966L1.68935 6.99999L2.75001 8.06065L3.28034 7.53032L7.25001 3.56065V14.25V15H8.75001V14.25V3.56065L12.7197 7.53032L13.25 8.06065L14.3107 6.99999L13.7803 6.46966L8.70711 1.39644Z"
					fill="currentColor"
				></path>
			</svg>
			Buy
		</Button>
	)
}