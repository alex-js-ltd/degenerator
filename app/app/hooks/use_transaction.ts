import { useMemo, useEffect } from 'react'
import { useAsync } from '@/app/hooks/use_async'
import { useSignAndSendTransaction } from '@/app/hooks/use_sign_and_send_transaction'
import { VersionedTransaction } from '@solana/web3.js'

export function useTransaction(serializedTransaction: Uint8Array | undefined) {
	const tx = useMemo(() => {
		if (!serializedTransaction) return null
		return VersionedTransaction.deserialize(serializedTransaction)
	}, [serializedTransaction])

	const signAndSendTransaction = useSignAndSendTransaction()

	const { run, ...rest } = useAsync<string | undefined>()

	useEffect(() => {
		if (tx) run(signAndSendTransaction(tx))
	}, [run, signAndSendTransaction, tx])

	return { run, ...rest }
}
