import type { VersionedTransaction } from '@solana/web3.js'
import { useConnection, useWallet } from '@jup-ag/wallet-adapter'
import { useCallback } from 'react'

export function useSendAndConfirmTx() {
	const { connection } = useConnection()

	const { sendTransaction } = useWallet()

	return useCallback(
		async (tx: VersionedTransaction) => {
			try {
				const txSig = await sendTransaction(tx, connection)

				const { blockhash, lastValidBlockHeight } =
					await connection.getLatestBlockhash()

				await connection.confirmTransaction({
					blockhash,
					lastValidBlockHeight,
					signature: txSig,
				})

				return txSig
			} catch (error) {
				console.log(error)
			}
		},
		[connection, sendTransaction],
	)
}
