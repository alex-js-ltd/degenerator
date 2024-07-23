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
		<RadixToast.Provider swipeDirection="right" duration={3600000}>
			<RadixToast.Root
				className="relative flex flex-col gap-1 items-start border border-toast-border rounded-[8px] w-fit h-auto p-4 data-[state=open]:animate-slide-in data-[state=closed]:animate-hide"
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
		<ExternalLink
			href={`https://solscan.io/tx/${txSig}?cluster=${cluster}`}
			variant="toast"
		>
			{`${label}: finalized 🚀`}
		</ExternalLink>
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
	const [isOpen, setIsOpen] = useState(false)
	const [mintTx, poolTx] = useTx()

	const toastDescriptions = useMemo(() => {
		const transactions = [
			{ label: 'Mint transaction', ...mintTx },
			{ label: 'Pool transaction', ...poolTx },
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
	}, [mintTx, poolTx])

	const handleOpenChange = useCallback((open: boolean) => setIsOpen(open), [])

	useEffect(() => {
		setIsOpen(toastDescriptions.length > 0)
	}, [toastDescriptions])

	return { toastDescriptions, isOpen, handleOpenChange }
}

function ToastTxs() {
	const { toastDescriptions, ...props } = useToastTxs()

	const toastElements = toastDescriptions?.map(element => (
		<Description key={element.props.label}>{element}</Description>
	))

	if (toastElements.length === 0) return null

	return <Toast {...props}>{toastElements}</Toast>
}

export { Toast, Description, ToastTxs }
