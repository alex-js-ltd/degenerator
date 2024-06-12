import type { VersionedTransaction } from '@solana/web3.js'
import { useConnection, useWallet } from '@jup-ag/wallet-adapter'
import { useCallback } from 'react'
import invariant from 'tiny-invariant'

export function useSendAndConfirmTx() {
	const { connection } = useConnection()

	const { sendTransaction } = useWallet()

	return useCallback(
		async (tx: VersionedTransaction) => {
			const txSig = await sendTransaction(tx, connection)

			const latestBlockHash = await connection.getLatestBlockhash()

			invariant(latestBlockHash, '😭🔫 Failed to get latest blockhash.')

			const confirm = await connection.confirmTransaction({
				blockhash: latestBlockHash.blockhash,
				lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
				signature: txSig,
			})
			console.log('confirm', confirm)
			console.log('transaction signature:', txSig)

			const transactionError = confirm.value.err
			invariant(transactionError === null, '😭🔫 Transaction not confirmed.')

			return confirm
		},
		[connection, sendTransaction],
	)
}
