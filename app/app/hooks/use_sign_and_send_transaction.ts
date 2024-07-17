import { VersionedTransaction } from '@solana/web3.js'
import { useConnection, useWallet } from '@jup-ag/wallet-adapter'
import { useCallback } from 'react'
import invariant from 'tiny-invariant'

const { deserialize } = VersionedTransaction

export function useSignAndSendTransaction() {
	const { connection } = useConnection()
	const { sendTransaction } = useWallet()

	return useCallback(
		async (serializedTransaction: Uint8Array) => {
			const tx = deserialize(serializedTransaction)
			const txSig = await sendTransaction(tx, connection)

			const latestBlockHash = await connection.getLatestBlockhash()

			invariant(latestBlockHash, 'Failed to get latest blockhash... 💩')

			const confirm = await connection.confirmTransaction({
				blockhash: latestBlockHash.blockhash,
				lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
				signature: txSig,
			})

			console.log(confirm)

			invariant(confirm, 'Transaction not confirmed... 😭🔫')

			invariant(confirm.value.err === null, 'Transaction not confirmed... 😭🔫')

			console.log(`Transaction ${txSig} confirmed 🚀`)

			return txSig
		},
		[connection, sendTransaction],
	)
}
