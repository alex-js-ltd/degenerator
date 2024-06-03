import type { VersionedTransaction, Transaction, Signer } from '@solana/web3.js'
import { useConnection, useWallet } from '@jup-ag/wallet-adapter'
import { useCallback } from 'react'

export function useSendAndConfirmTx() {
	const { connection } = useConnection()

	const { sendTransaction } = useWallet()

	return useCallback(
		async (tx: VersionedTransaction | Transaction) => {
			try {
				const txSig = await sendTransaction(tx, connection)

				const { blockhash, lastValidBlockHeight } =
					await connection.getLatestBlockhash()

				const res = await connection.confirmTransaction({
					blockhash,
					lastValidBlockHeight,
					signature: txSig,
				})

				console.log('res', res)
				console.log('txsig', txSig)
				return txSig
			} catch (error) {
				console.log(error)
			}
		},
		[connection, sendTransaction],
	)
}
