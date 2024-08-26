import { VersionedTransaction } from '@solana/web3.js'
import { useWallet } from '@jup-ag/wallet-adapter'
import { useCallback } from 'react'
import { connection } from '@/app/utils/setup'

const { deserialize } = VersionedTransaction

export function useSignAndSendTx() {
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

			console.log(`Transaction ${signature} finalized 🚀`)

			return signature
		},
		[sendTransaction],
	)
}
