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

function Toast({ children, ...props }: ToastProps) {
	return (
		<RadixToast.Provider swipeDirection="right" duration={60000}>
			<RadixToast.Root
				className="relative flex flex-col gap-1 items-start border border-toast-border rounded-[8px] w-fit h-auto p-4 data-[state=open]:animate-scale-in-50 data-[state=closed]:animate-scale-out-50"
				{...props}
			>
				{children}
			</RadixToast.Root>

			<RadixToast.Viewport className="fixed bottom-6 left-6 sm:bottom-4 sm:left-4 flex m-0 list-none z-50 w-full max-w-[420px] h-auto" />
		</RadixToast.Provider>
	)
}

const Description = RadixToast.Description

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

function getIsError(error: unknown, label: string, txSig?: string | null) {
	const href = txSig
		? `https://solscan.io/tx/${txSig}?cluster=${cluster}`
		: undefined
	return (
		<ExternalLink href={href} variant="toast">
			{label}:&nbsp;
			<span className="lowercase">{getErrorMessage(error)}</span>
		</ExternalLink>
	)
}

function useToastTxs() {
	const [open, setOpen] = useState(false)
	const { mintTx, poolTx } = useTx()

	const descriptions = useMemo(() => {
		const initial: { type: string; element: ReactElement }[] = []

		return [
			{ label: 'Mint transaction', tx: mintTx },
			{ label: 'Pool transaction', tx: poolTx },
		].reduce((acc, curr) => {
			const { data, isError, error } = curr.tx

			if (data) {
				acc.push({ type: curr.label, element: getIsSuccess(data, curr.label) })
			}

			if (isError) {
				acc.push({
					type: curr.label,
					element: getIsError(error, curr.label, data),
				})
			}

			return acc
		}, initial)
	}, [mintTx, poolTx])

	const onOpenChange = useCallback(
		(open: boolean) => setOpen(open),
		[descriptions],
	)

	useEffect(() => {
		if (descriptions.length) setOpen(true)
	}, [descriptions])

	return { descriptions, open, onOpenChange }
}

function ToastTxs() {
	const { descriptions, ...props } = useToastTxs()

	const children = descriptions.map(({ element, type }) => (
		<Description key={type}>{element}</Description>
	))

	return <Toast {...props}>{children}</Toast>
}

export { Toast, Description, ToastTxs }
