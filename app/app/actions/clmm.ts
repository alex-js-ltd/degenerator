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
	type ClmmKeys,
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

	const { instructions, signers, poolId } = await createPool({
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

	// USDT
	const mint2 = await raydium.token.getTokenInfo(
		'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
	)
	const clmmConfigs = await raydium.api.getClmmConfigs()

	const { builder, extInfo } = await raydium.clmm.createPool({
		programId: CLMM_PROGRAM_ID,
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
	})

	const address: ClmmKeys & { poolId?: string } = extInfo.address

	return {
		instructions: builder.AllTxData.instructions,
		signers: builder.AllTxData.signers,
		poolId: address?.poolId,
	}
}