import type { VersionedTransaction } from '@solana/web3.js'
import { useConnection, useWallet } from '@jup-ag/wallet-adapter'
import { useCallback } from 'react'
import invariant from 'tiny-invariant'

export function useSignAllTransactions() {
	const { connection } = useConnection()
	const { signAllTransactions } = useWallet()

	return useCallback(
		async (tx: VersionedTransaction[]) => {
			if (!signAllTransactions) return
			const res = await signAllTransactions(tx)

			console.log(res)

			return res
		},
		[connection, signAllTransactions],
	)
}
