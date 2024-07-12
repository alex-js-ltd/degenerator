import type { VersionedTransaction } from '@solana/web3.js'
import { useConnection, useWallet } from '@jup-ag/wallet-adapter'
import { useCallback } from 'react'
import invariant from 'tiny-invariant'

export function useSignAndSendTransaction() {
	const { connection } = useConnection()
	const { sendTransaction } = useWallet()

	return useCallback(
		async (tx: VersionedTransaction | undefined) => {
			if (!tx) return
			const txSig = await sendTransaction(tx, connection)
			console.log(txSig)
			const latestBlockHash = await connection.getLatestBlockhash()

			invariant(latestBlockHash, 'Failed to get latest blockhash... 💩')

			const confirm = await connection.confirmTransaction({
				blockhash: latestBlockHash.blockhash,
				lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
				signature: txSig,
			})

			invariant(confirm, 'Transaction not confirmed... 😭🔫')

			invariant(confirm.value.err === null, 'Transaction not confirmed... 😭🔫')

			console.log(`Transaction ${txSig} confirmed 🚀`)

			return txSig
		},
		[connection, sendTransaction],
	)
}
