'use client'

import { Button, type ButtonProps } from '@/app/comps/button'
import { Icon } from '@/app/comps/_icon'
import { Spinner } from '@/app/comps/spinner'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'
import { useFormStatus } from 'react-dom'
import { Tooltip, Content } from '@/app/comps/tooltip'

type SubmitButtonProps = ButtonProps & {
	isLoading?: boolean
}

export function SubmitButton({ isLoading, ...rest }: SubmitButtonProps) {
	const wallet = useAnchorWallet()
	const { publicKey } = wallet || {}

	const { pending } = useFormStatus()
	const disabled = !publicKey || pending || isLoading ? true : false

	return (
		<Tooltip
			rootProps={{ open: publicKey ? undefined : false }}
			content={
				<Content
					className="data-[state=delayed-open]:data-[side=bottom]:animate-slide-up-and-fade data-[state=closed]:data-[side=bottom]:animate-slide-down-and-fade z-50 bg-gray-900 shadow-lg text-white overflow-hidden rounded-md bg-primary px-[12px] h-[32px] text-sm flex items-center leading-none will-change-[transform,opacity]"
					sideOffset={18}
					align="end"
					alignOffset={-12}
					side="bottom"
				>
					Mint Token
				</Content>
			}
		>
			<span className={publicKey ? 'cursor-pointer' : 'cursor-not-allowed'}>
				<Button type="submit" disabled={disabled} {...rest} variant="submit">
					{pending || isLoading ? (
						<Spinner />
					) : (
						<Icon name="arrow-up" className="w-6 h-6" />
					)}
				</Button>
			</span>
		</Tooltip>
	)
}
