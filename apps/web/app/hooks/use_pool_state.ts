import { fetchPoolState } from '@repo/degenerator'
import { program } from '@/app/utils/setup'
import { useAsync } from './use_async'
import { useEffect, useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'

type PoolState = Awaited<ReturnType<typeof fetchPoolState>>

export function usePoolState(mint: string) {
	const { run, ...rest } = useAsync<PoolState>()

	const _mint = useMemo(() => mint, [mint])

	useEffect(() => {
		const promise = fetchPoolState({ program, mint: new PublicKey(_mint) })

		run(promise)
	}, [run, _mint])

	return { ...rest }
}
