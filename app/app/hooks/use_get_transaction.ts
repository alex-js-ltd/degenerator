import { useConnection } from '@jup-ag/wallet-adapter'
import { useCallback, useEffect, useMemo } from 'react'
import { useAsync } from './use_async'
import { type VersionedTransactionResponse } from '@solana/web3.js'

export function useGetTransaction() {
	const { connection } = useConnection()

	return useCallback(
		async (txSig: string) => {
			return await connection.getTransaction(txSig, {
				maxSupportedTransactionVersion: 0,
			})
		},
		[connection],
	)
}
