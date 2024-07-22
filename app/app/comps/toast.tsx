'use client'

import * as RadixToast from '@radix-ui/react-toast'
import {
	type ReactNode,
	type ReactElement,
	useState,
	useMemo,
	useEffect,
	useCallback,
} from 'react'
import { useTx } from '@/app/context/tx_context'
import { getEnv } from '@/app/utils/env'
import { getErrorMessage } from '@/app/utils/misc'
import { ExternalLink } from '@/app/comps/external_link'

const { CLUSTER } = getEnv()
const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

export interface ToastProps extends RadixToast.ToastProps {
	children?: ReactNode
}

interface Description {
	label: string
	element: ReactElement
}

function Toast({ children, ...props }: ToastProps) {
	return (
		<RadixToast.Provider swipeDirection="right" duration={3600000}>
			<RadixToast.Root
				className="relative flex flex-col gap-1 items-start border border-toast-border rounded-[8px] w-fit h-auto p-4 data-[state=open]:animate-slide-in data-[state=closed]:animate-hide"
				{...props}
			>
				{children}
			</RadixToast.Root>

			<RadixToast.Viewport className="fixed bottom-0 left-0 sm:p-4 p-6 flex m-0 list-none z-50 w-fit h-auto" />
		</RadixToast.Provider>
	)
}

const Description = RadixToast.Description

function getIsLoading(label: string) {
	return (
		<div className="flex text-toast-text text-sm">
			{label}:&nbsp;
			<span className="lowercase animate-pulse">confirming&nbsp;⏳</span>
		</div>
	)
}

function getIsSuccess(txSig: string, label: string) {
	return (
		<ExternalLink
			href={`https://solscan.io/tx/${txSig}?cluster=${cluster}`}
			variant="toast"
		>
			{label}: finalized&nbsp;🚀
		</ExternalLink>
	)
}

function getIsError(error: unknown, label: string) {
	return (
		<div className="flex text-toast-text text-sm">
			{label}:&nbsp;
			<span className="lowercase break-word break-all">
				{getErrorMessage(error)}
			</span>
		</div>
	)
}

function useToastTxs() {
	const [open, setOpen] = useState(false)
	const [mintTx, poolTx] = useTx()

	const descriptions = useMemo(() => {
		const allTxs = [
			{ label: 'Mint transaction', ...mintTx },
			{ label: 'Pool transaction', ...poolTx },
		]

		return allTxs.reduce<Description[]>((acc, curr) => {
			const { label, data, isLoading, isError, error } = curr

			if (isLoading) {
				acc.push({ label, element: getIsLoading(label) })
			}

			if (data) {
				acc.push({ label, element: getIsSuccess(data, label) })
			}

			if (isError) {
				acc.push({
					label: label,
					element: getIsError(error, label),
				})
			}

			return acc
		}, [])
	}, [mintTx, poolTx])

	const onOpenChange = useCallback(
		(open: boolean) => setOpen(open),
		[descriptions],
	)

	useEffect(() => {
		if (descriptions.length > 0) setOpen(true)
	}, [descriptions])

	return { descriptions, open, onOpenChange }
}

function ToastTxs() {
	const { descriptions, ...props } = useToastTxs()

	const children = descriptions.map(({ label, element }) => (
		<Description key={label}>{element}</Description>
	))

	return <Toast {...props}>{children}</Toast>
}

export { Toast, Description, ToastTxs }
