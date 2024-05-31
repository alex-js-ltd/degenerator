'use client'

import { Button, type ButtonProps } from '@/app/comps/button'
import { Icon } from '@/app/comps/_icon'
import { Spinner } from './spinner'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'
import { useFormStatus } from 'react-dom'

type SubmitButtonProps = ButtonProps & {
	isLoading?: boolean
}

export function SubmitButton({ isLoading, ...rest }: SubmitButtonProps) {
	const wallet = useAnchorWallet()
	const { publicKey } = wallet || {}

	const { pending } = useFormStatus()
	const disabled = !publicKey || pending || isLoading ? true : false

	console.log('disabled', disabled)
	return (
		<Button type="submit" disabled={disabled} {...rest}>
			{pending || isLoading ? (
				<Spinner />
			) : (
				<Icon name="arrow-up" className="w-6 h-6" />
			)}
		</Button>
	)
}
