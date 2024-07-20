import { useConnection } from '@jup-ag/wallet-adapter'
import { useCallback, useEffect, useMemo } from 'react'
import { useAsync } from './use_async'
import { type VersionedTransactionResponse } from '@solana/web3.js'

export function useGetTransaction(txSig?: string | null) {
	const { connection } = useConnection()

	const get = useCallback(
		async (txSig: string) => {
			return await connection.getTransaction(txSig, {
				maxSupportedTransactionVersion: 0,
			})
		},
		[connection],
	)
	const { run, data } = useAsync<VersionedTransactionResponse | null>()

	useEffect(() => {
		if (txSig) run(get(txSig))
	}, [run, get, txSig])

	return useMemo(() => {
		return { isSuccess: data?.meta?.err === null }
	}, [data])
}
