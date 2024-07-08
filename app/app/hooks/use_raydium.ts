import {
	Raydium,
	TxVersion,
	parseTokenAccountResp,
	CLMM_PROGRAM_ID,
	DEVNET_PROGRAM_ID,
	DEV_API_URLS,
	API_URLS,
	type ClmmKeys,
} from '@raydium-io/raydium-sdk-v2'
import { Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'

import { useWallet, useConnection } from '@jup-ag/wallet-adapter'
import { getEnv } from '@/app/utils/env'
import { useCallback } from 'react'

const { CLUSTER } = getEnv()

export const txVersion = TxVersion.V0 // or TxVersion.LEGACY
const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

const BASE_HOST =
	CLUSTER === 'mainnet-beta' ? API_URLS.BASE_HOST : DEV_API_URLS.BASE_HOST
export function useRaydium() {
	const { connection } = useConnection()
	const { signAllTransactions } = useWallet()

	return useCallback(
		async ({ owner, loadToken }: { owner: PublicKey; loadToken?: boolean }) => {
			const raydium = await Raydium.load({
				owner: owner,
				connection,
				cluster,
				disableFeatureCheck: true,
				disableLoadToken: loadToken,
				blockhashCommitment: 'finalized',
				signAllTransactions,
				urlConfigs: {
					BASE_HOST,
				},
			})

			/**
			 * By default: sdk will automatically fetch token account data when need it or any sol balace changed.
			 * if you want to handle token account by yourself, set token account data after init sdk
			 * code below shows how to do it.
			 * note: after call raydium.account.updateTokenAccount, raydium will not automatically fetch token account
			 */

			raydium.account.updateTokenAccount(
				await fetchTokenAccountData({ connection, owner }),
			)
			connection.onAccountChange(owner, async () => {
				raydium!.account.updateTokenAccount(
					await fetchTokenAccountData({ connection, owner }),
				)
			})

			console.log(raydium.token.tokenList)
			return raydium
		},
		[connection, signAllTransactions],
	)
}

const fetchTokenAccountData = async ({
	connection,
	owner,
}: {
	connection: Connection
	owner: PublicKey
}) => {
	const solAccountResp = await connection.getAccountInfo(owner)
	const tokenAccountResp = await connection.getTokenAccountsByOwner(owner, {
		programId: TOKEN_PROGRAM_ID,
	})
	const token2022Req = await connection.getTokenAccountsByOwner(owner, {
		programId: TOKEN_2022_PROGRAM_ID,
	})
	const tokenAccountData = parseTokenAccountResp({
		owner,
		solAccountResp,
		tokenAccountResp: {
			context: tokenAccountResp.context,
			value: [...tokenAccountResp.value, ...token2022Req.value],
		},
	})
	return tokenAccountData
}
