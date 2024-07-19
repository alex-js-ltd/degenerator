import {
	VersionedTransaction,
	type SignatureStatus,
	Commitment,
} from '@solana/web3.js'
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

			const blocks = connection.getLatestBlockhash()
			const send = sendTransaction(tx, connection, {
				skipPreflight: false,
			})

			const [latestBlockhash, signature] = await Promise.all([blocks, send])

			const confirm = await connection.confirmTransaction(
				{
					...latestBlockhash,
					signature,
				},
				'finalized',
			)

			invariant(confirm, 'Transaction not finalized... 😭🔫')

			invariant(confirm.value.err, 'Transaction not finalized... 😭🔫')

			console.log(`Transaction ${signature} finalized 🚀`)

			return signature
		},
		[connection, sendTransaction],
	)
}
