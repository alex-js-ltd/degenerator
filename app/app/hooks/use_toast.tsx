import { useTx } from '@/app/context/tx_context'
import { type ReactElement, useState, useMemo, useEffect } from 'react'
import { getEnv } from '@/app/utils/env'
import { getErrorMessage } from '@/app/utils/misc'
import { ExternalLink } from '@/app/comps/external_link'

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

export function useToast() {
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

	return { descriptions, open }
}
