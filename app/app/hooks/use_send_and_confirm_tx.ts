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

			const { blockhash, lastValidBlockHeight } =
				await connection.getLatestBlockhash()

			const confirm = await connection.confirmTransaction({
				blockhash,
				lastValidBlockHeight,
				signature: txSig,
			})
			console.log('confirm', confirm)
			console.log('transaction signature:', txSig)
			invariant(!!confirm.value.err, '😭🔫 Transaction not confirmed.')
			return confirm
		},
		[connection, sendTransaction],
	)
}
