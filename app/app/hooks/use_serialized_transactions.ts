import { VersionedTransaction } from '@solana/web3.js'
import { useMemo } from 'react'

export function useSerializedTransactions({
	serializedTransactions,
}: {
	serializedTransactions: Uint8Array[] | undefined
}) {
	return useMemo(() => {
		if (!serializedTransactions) return

		return serializedTransactions.map(trans =>
			VersionedTransaction.deserialize(trans),
		)
	}, [serializedTransactions])
}
