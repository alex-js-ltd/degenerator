'use server'

import invariant from 'tiny-invariant'
import { connection } from '@/app/utils/setup'
import { PublicKey, type Connection } from '@solana/web3.js'
import {
	Raydium,
	DEV_API_URLS,
	API_URLS,
	parseTokenAccountResp,
} from '@raydium-io/raydium-sdk-v2'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { getEnv } from '@/app/utils/env'

const { CLUSTER } = getEnv()

const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : 'devnet'

export async function initSdk({
	owner,
	loadToken,
}: {
	owner?: PublicKey
	loadToken?: boolean
}) {
	const BASE_HOST =
		CLUSTER === 'devnet' ? DEV_API_URLS.BASE_HOST : API_URLS.BASE_HOST

	const raydium = await Raydium.load({
		owner,
		connection,
		cluster,
		disableFeatureCheck: true,
		disableLoadToken: loadToken,
		blockhashCommitment: 'finalized',

		urlConfigs: {
			BASE_HOST,
		},
	})

	invariant(raydium, 'Failed to initialize raydium')

	/**
	 * By default: sdk will automatically fetch token account data when need it or any sol balace changed.
	 * if you want to handle token account by yourself, set token account data after init sdk
	 * code below shows how to do it.
	 * note: after call raydium.account.updateTokenAccount, raydium will not automatically fetch token account
	 */

	return raydium
}

export async function fetchTokenAccountData({
	connection,
	owner,
}: {
	connection: Connection
	owner: PublicKey
}) {
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
