import { VersionedTransaction } from '@solana/web3.js'
import { useMemo } from 'react'

export function useSerializedTransaction({
	serializedTransaction,
}: {
	serializedTransaction: Uint8Array | undefined
}) {
	return useMemo(() => {
		if (!serializedTransaction) return

		return VersionedTransaction.deserialize(serializedTransaction)
	}, [serializedTransaction])
}
