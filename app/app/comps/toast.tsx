'use client'

import * as ToastPrimitive from '@radix-ui/react-toast'
import { Icon } from './_icon'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/utils/misc'
import { type ReactElement } from 'react'
import { getEnv } from '@/app/utils/env'
import { getErrorMessage } from '@/app/utils/misc'

const { CLUSTER } = getEnv()

const toastVariants = cva(
	'border-2 border-gray-300 rounded-[8px] h-[37px] flex items-center px-3',
	{
		variants: {
			variant: {
				success: 'bg-success-bg text-teal-300',
				error: 'bg-error-bg text-error-text',
			},
		},
	},
)

export interface ToastProps
	extends ToastPrimitive.ToastProps,
		VariantProps<typeof toastVariants> {
	message: ReactElement
}

function Toast({ open, variant, message, ...props }: ToastProps) {
	return (
		<ToastPrimitive.Provider swipeDirection="right">
			<ToastPrimitive.Root
				className={cn(toastVariants({ variant }))}
				open={open}
				{...props}
			>
				<Icon name="error" className="w-[20px] h-[20px]" />
				<ToastPrimitive.Description className="flex items-center h-full ml-3 text-xs">
					{message}
				</ToastPrimitive.Description>
			</ToastPrimitive.Root>
			<ToastPrimitive.Viewport className="fixed bottom-6 left-6 flex m-0 list-none z-[2147483647] w-fit h-auto" />
		</ToastPrimitive.Provider>
	)
}

function getSuccessProps({
	isSuccess,
	txSig,
}: {
	isSuccess: boolean
	txSig: string
}): ToastProps {
	const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

	const href = `https://solscan.io/tx/${txSig}?cluster=${cluster}`

	const Message = () => (
		<a href={href} target="_blank">
			Transaction confirmed 🚀
		</a>
	)

	return {
		open: isSuccess,
		message: <Message />,
		variant: 'success',
	}
}

function getErrorProps({
	isError,
	error,
}: {
	isError: boolean
	error: unknown
}): ToastProps {
	const Message = () => <div>{getErrorMessage(error)}</div>

	return {
		open: isError,
		message: <Message />,
		variant: 'error',
	}
}

export { Toast, getSuccessProps, getErrorProps }
