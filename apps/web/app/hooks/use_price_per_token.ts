import { getPricePerToken } from '@repo/degenerator'
import { program } from '@/app/utils/setup'
import { useAsync } from './use_async'
import { useEffect, useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'

type PricePerToken = Awaited<ReturnType<typeof getPricePerToken>>

export function usePricePerToken(mint: string) {
	const { run, ...rest } = useAsync<PricePerToken>()

	const _mint = useMemo(() => mint, [mint])
	useEffect(() => {
		const promise = getPricePerToken({ program, mint: new PublicKey(_mint) })
		run(promise)
	}, [run, _mint])

	return { ...rest }
}
