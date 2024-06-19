import type { VersionedTransaction, Transaction } from '@solana/web3.js'
import { useConnection, useWallet } from '@jup-ag/wallet-adapter'
import { useCallback } from 'react'
import invariant from 'tiny-invariant'

export function useSignAndSendTransactionLegacy() {
	const { connection } = useConnection()
	const { sendTransaction, signTransaction } = useWallet()

	return useCallback(
		async (tx: Transaction) => {
			if (!signTransaction) return
			const signedTransaction = await signTransaction(tx)

			const txnSignature = await connection.sendRawTransaction(
				signedTransaction.serialize(),
			)

			console.log(txnSignature)
			return txnSignature
		},
		[connection, sendTransaction],
	)
}
