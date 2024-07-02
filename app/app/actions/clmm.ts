'use server'

import { parseWithZod } from '@conform-to/zod'
import { ClmmSchema } from '@/app/utils/schemas'
import invariant from 'tiny-invariant'
import { connection } from '@/app/utils/setup'
import { TransactionMessage, VersionedTransaction } from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'

import { type Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import {
	Raydium,
	TxVersion,
	parseTokenAccountResp,
	CLMM_PROGRAM_ID,
	DEVNET_PROGRAM_ID,
} from '@raydium-io/raydium-sdk-v2'
import Decimal from 'decimal.js'

import { getEnv } from '@/app/utils/env'

const { CLUSTER } = getEnv()

const txVersion = TxVersion.V0 // or TxVersion.LEGACY
const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

export async function clmm(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: ClmmSchema,
	})

	if (submission.status !== 'success') {
		return {
			...submission.reply(),
			serializedTransaction: undefined,
		}
	}

	const { owner, mint1 } = submission.value

	const raydium = await initSdk({ owner })

	const { instructions, signers } = await createPool({
		raydium,
		mint1,
	})

	let blockhash = await connection
		.getLatestBlockhash()
		.then(res => res.blockhash)

	const messageV0 = new TransactionMessage({
		payerKey: owner,
		recentBlockhash: blockhash,
		instructions,
	}).compileToV0Message()

	const transaction = new VersionedTransaction(messageV0)

	transaction.sign(signers)

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
	const raydium = await Raydium.load({
		owner,
		connection,
		cluster,
		disableFeatureCheck: true,
		disableLoadToken: loadToken,
		blockhashCommitment: 'finalized',
		// urlConfigs: {
		// 	BASE_HOST: CLUSTER, // api url configs, currently api doesn't support devnet
		// },
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
}: {
	raydium: Raydium
	mint1: PublicKey
}) {
	const mint1 = await raydium.token.getTokenInfo(mint1Key)

	console.log(mint1)

	// USDT
	const mint2 = await raydium.token.getTokenInfo(
		'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
	)
	const mainConfigs = await raydium.api.getClmmConfigs()

	const clmmConfigs = CLUSTER === 'mainnet-beta' ? mainConfigs : devConfigs // devnet configs

	const programId =
		CLUSTER === 'mainnet-beta' ? CLMM_PROGRAM_ID : DEVNET_PROGRAM_ID.CLMM

	const { builder } = await raydium.clmm.createPool({
		programId,
		mint1,
		mint2,
		ammConfig: {
			...clmmConfigs[0],
			id: new PublicKey(clmmConfigs[0].id),
			fundOwner: '',
		},
		initialPrice: new Decimal(1),
		startTime: new BN(0),
		txVersion,
		// optional: set up priority fee here
		// computeBudgetConfig: {
		//   units: 600000,
		//   microLamports: 100000000,
		// },
	})

	return {
		instructions: builder.AllTxData.instructions,
		signers: builder.AllTxData.signers,
	}
}

const devConfigs = [
	{
		id: 'CQYbhr6amxUER4p5SC44C63R4qw4NFc9Z4Db9vF4tZwG',
		index: 0,
		protocolFeeRate: 120000,
		tradeFeeRate: 100,
		tickSpacing: 10,
		fundFeeRate: 40000,
		description: 'Best for very stable pairs',
		defaultRange: 0.005,
		defaultRangePoint: [0.001, 0.003, 0.005, 0.008, 0.01],
	},
	{
		id: 'B9H7TR8PSjJT7nuW2tuPkFC63z7drtMZ4LoCtD7PrCN1',
		index: 1,
		protocolFeeRate: 120000,
		tradeFeeRate: 2500,
		tickSpacing: 60,
		fundFeeRate: 40000,
		description: 'Best for most pairs',
		defaultRange: 0.1,
		defaultRangePoint: [0.01, 0.05, 0.1, 0.2, 0.5],
	},
	{
		id: 'GjLEiquek1Nc2YjcBhufUGFRkaqW1JhaGjsdFd8mys38',
		index: 3,
		protocolFeeRate: 120000,
		tradeFeeRate: 10000,
		tickSpacing: 120,
		fundFeeRate: 40000,
		description: 'Best for exotic pairs',
		defaultRange: 0.1,
		defaultRangePoint: [0.01, 0.05, 0.1, 0.2, 0.5],
	},
	{
		id: 'GVSwm4smQBYcgAJU7qjFHLQBHTc4AdB3F2HbZp6KqKof',
		index: 2,
		protocolFeeRate: 120000,
		tradeFeeRate: 500,
		tickSpacing: 10,
		fundFeeRate: 40000,
		description: 'Best for tighter ranges',
		defaultRange: 0.1,
		defaultRangePoint: [0.01, 0.05, 0.1, 0.2, 0.5],
	},
]
