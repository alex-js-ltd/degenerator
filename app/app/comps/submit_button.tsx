'use client'

import { Button, type ButtonProps } from '@/app/comps/button'
import { Icon } from '@/app/comps/_icon'
import { Spinner } from '@/app/comps/spinner'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'
import { Tooltip, Content } from '@/app/comps/tooltip'
import { useTxStatus, useResetTx } from '@/app/context/tx_context'

type SubmitButtonProps = ButtonProps & {
	content?: string
}

export function SubmitButton({ content, ...rest }: SubmitButtonProps) {
	const wallet = useAnchorWallet()
	const { publicKey } = wallet || {}

	const { isLoading } = useTxStatus()
	const disabled = !publicKey || isLoading ? true : false

	const reset = useResetTx()

	const cursor = isLoading
		? 'cursor-default'
		: publicKey && !isLoading
		? 'cursor-pointer'
		: 'cursor-not-allowed'

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
					{content}
				</Content>
			}
		>
			<span className={cursor}>
				<Button
					{...rest}
					type="submit"
					disabled={disabled}
					variant="submit"
					onClick={reset}
				>
					{isLoading ? (
						<Spinner />
					) : (
						<Icon name="arrow-up" className="w-6 h-6" />
					)}
				</Button>
			</span>
		</Tooltip>
	)
}
