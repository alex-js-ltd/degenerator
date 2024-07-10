'use server'

import { parseWithZod } from '@conform-to/zod'
import { ClmmSchema } from '@/app/utils/schemas'
import invariant from 'tiny-invariant'
import { connection } from '@/app/utils/setup'
import { BN } from '@coral-xyz/anchor'

import { type Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
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
import Decimal from 'decimal.js'

import { getEnv } from '@/app/utils/env'
import { getClmmConfigs } from '@/app/utils/clmm'

const { CLUSTER } = getEnv()

const txVersion = TxVersion.V0 // or TxVersion.LEGACY
const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

export async function clmm(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: ClmmSchema,
	})

	console.log(submission)
	if (submission.status !== 'success') {
		return {
			...submission.reply(),
			serializedTransaction: undefined,
		}
	}

	const { payerKey, mint1, mint2, feeTier } = submission.value

	const raydium = await initSdk({ owner: payerKey })

	const { transaction } = await createPool({
		raydium,
		mint1,
		mint2,
		feeTier,
	})

	const serializedTransaction = transaction.serialize()

	return {
		...submission.reply(),
		serializedTransaction,
	}
}

async function initSdk({
	owner,
	loadToken,
}: {
	owner: PublicKey
	loadToken?: boolean
}) {
	const BASE_HOST =
		CLUSTER === 'mainnet-beta' ? API_URLS.BASE_HOST : DEV_API_URLS.BASE_HOST

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

	raydium.account.updateTokenAccount(
		await fetchTokenAccountData({ connection, owner }),
	)
	connection.onAccountChange(owner, async () => {
		raydium!.account.updateTokenAccount(
			await fetchTokenAccountData({ connection, owner }),
		)
	})

	return raydium
}

async function fetchTokenAccountData({
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

async function createPool({
	raydium,
	mint1: mint1Key,
	mint2: mint2Key,
	feeTier,
}: {
	raydium: Raydium
	mint1: PublicKey
	mint2: PublicKey
	feeTier: string
}) {
	const mint1 = await raydium.token.getTokenInfo(mint1Key)
	const mint2 = await raydium.token.getTokenInfo(mint2Key)
	const clmmConfigs = await getClmmConfigs({ raydium })

	const clmmConfig = clmmConfigs.find(el => el.id === feeTier)

	invariant(clmmConfig, 'Failed to find clmmConfig')

	const programId =
		cluster === 'mainnet' ? CLMM_PROGRAM_ID : DEVNET_PROGRAM_ID.CLMM

	const { builder, extInfo, transaction } = await raydium.clmm.createPool({
		programId,
		mint1,
		mint2,
		ammConfig: {
			...clmmConfig,
			id: new PublicKey(clmmConfig.id),
			fundOwner: '',
		},
		initialPrice: new Decimal(1),
		startTime: new BN(0),
		txVersion,
	})

	const address: ClmmKeys & { poolId?: string } = extInfo.address

	return {
		poolId: address?.poolId,
		transaction,
	}
}
