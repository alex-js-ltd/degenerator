import type {
	VersionedTransaction,
	RpcResponseAndContext,
	SignatureResult,
} from '@solana/web3.js'
import { useConnection, useWallet } from '@jup-ag/wallet-adapter'
import { useCallback } from 'react'

export function useSendAndConfirmTx() {
	const { connection } = useConnection()

	const { sendTransaction } = useWallet()

	return useCallback(
		async (
			tx: VersionedTransaction,
		): Promise<RpcResponseAndContext<SignatureResult>> => {
			const txSig = await sendTransaction(tx, connection)

			const { blockhash, lastValidBlockHeight } =
				await connection.getLatestBlockhash()

			const res = await connection.confirmTransaction({
				blockhash,
				lastValidBlockHeight,
				signature: txSig,
			})

			return res
		},
		[connection, sendTransaction],
	)
}
