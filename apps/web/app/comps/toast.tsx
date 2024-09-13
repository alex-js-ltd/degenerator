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
import Link from 'next/link'

const { CLUSTER } = getEnv()
const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

export interface ToastProps extends RadixToast.ToastProps {
	children?: ReactNode
}

function Toast({ children, ...props }: ToastProps) {
	return (
		<RadixToast.Provider swipeDirection="left" duration={60000}>
			<RadixToast.Root
				className="data-[state=open]:animate-scale-in-50 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipe-out relative flex flex-col gap-1 items-start border border-toast-border rounded-[8px] w-fit h-auto p-4"
				{...props}
			>
				{children}
			</RadixToast.Root>
			<RadixToast.Viewport className="fixed bottom-0 left-0 sm:p-4 p-6 flex m-0 list-none z-50 w-fit h-auto sm:max-w-[576px] max-w-full" />
		</RadixToast.Provider>
	)
}

const Description = RadixToast.Description

function Loading({ label }: { label: string }) {
	return (
		<div className="flex text-toast-text text-sm animate-pulse">
			{`${label}: confirming ⏳`}
		</div>
	)
}

function Finalized({ txSig, label }: { txSig: string; label: string }) {
	return (
		<Link
			href={`https://solscan.io/tx/${txSig}?cluster=${cluster}`}
			target="_blank"
			rel="noopener noreferrer"
			className="flex text-toast-text text-sm"
		>
			{`${label}: finalized 🚀`}
		</Link>
	)
}

function Error({ error, label }: { error: unknown; label: string }) {
	return (
		<div className="flex text-toast-text text-sm break-word break-all">
			{`${label}:`}&nbsp;
			<span className="lowercase">{getErrorMessage(error)}</span>
		</div>
	)
}

function useToastTxs() {
	const [open, setOpen] = useState(false)
	const [mintTx, swapTx] = useTx()

	const toastDescriptions = useMemo(() => {
		const transactions = [
			{ label: 'Mint transaction', ...mintTx },
			{ label: 'Swap transaction', ...swapTx },
		]

		return transactions.reduce<ReactElement[]>((acc, tx) => {
			const { isLoading, data, error, label } = tx

			if (isLoading) {
				acc.push(<Loading label={label} />)
			}

			if (data) {
				acc.push(<Finalized txSig={data} label={label} />)
			}

			if (error) {
				acc.push(<Error error={error} label={label} />)
			}

			return acc
		}, [])
	}, [mintTx])

	const onOpenChange = useCallback((open: boolean) => setOpen(open), [])

	useEffect(() => {
		setOpen(toastDescriptions.length > 0)
	}, [toastDescriptions])

	return { toastDescriptions, open, onOpenChange }
}

function ToastTxs() {
	const { toastDescriptions, open, onOpenChange } = useToastTxs()

	const toastElements = toastDescriptions.map(element => (
		<Description key={element.props.label}>{element}</Description>
	))

	if (toastElements.length === 0) return null

	return (
		<Toast open={open} onOpenChange={onOpenChange}>
			{toastElements}
		</Toast>
	)
}

export { Toast, Description, ToastTxs }
