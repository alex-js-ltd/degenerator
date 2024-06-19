import { useMemo } from 'react'
import { Transaction } from '@solana/web3.js'

export function useEncodedTransaction({
	encoded_transaction,
}: {
	encoded_transaction?: string
}) {
	return useMemo(() => {
		if (!encoded_transaction) return
		let recoveredTransaction = Transaction.from(
			Buffer.from(encoded_transaction, 'base64'),
		)
		return recoveredTransaction
	}, [encoded_transaction])
}
