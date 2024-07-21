'use client'

import { useTx } from '@/app/context/tx_context'
import {
	type ReactElement,
	useState,
	useMemo,
	useEffect,
	useCallback,
} from 'react'
import { getEnv } from '@/app/utils/env'
import { getErrorMessage } from '@/app/utils/misc'
import { ExternalLink } from '@/app/comps/external_link'
import { Toast, Description } from '@/app/comps/toast'

const { CLUSTER } = getEnv()
const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

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

function useTransactionStatus() {
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

	useEffect(() => {
		if (descriptions.length) setOpen(true)
		else setOpen(false)
	}, [descriptions])

	function onOpenChange(open: boolean) {
		setOpen(open)
	}

	return { descriptions, open, onOpenChange }
}

export function TransactionStatus() {
	const { descriptions, ...props } = useTransactionStatus()

	return (
		<Toast {...props}>
			{descriptions.map(({ element, type }) => (
				<Description key={type}>{element}</Description>
			))}
		</Toast>
	)
}
