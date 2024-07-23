'use server'

import { parseWithZod } from '@conform-to/zod'
import { ClmmSchema } from '@/app/utils/schemas'
import invariant from 'tiny-invariant'
import { BN } from '@coral-xyz/anchor'

import { PublicKey } from '@solana/web3.js'

import {
	Raydium,
	TxVersion,
	CLMM_PROGRAM_ID,
	DEVNET_PROGRAM_ID,
} from '@raydium-io/raydium-sdk-v2'
import Decimal from 'decimal.js'

import { getEnv } from '@/app/utils/env'
import { initSdk, getClmmConfigs } from '@/app/utils/raydium'

const { CLUSTER } = getEnv()

const txVersion = TxVersion.V0 // or TxVersion.LEGACY
const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : 'devnet'

export async function clmm(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: ClmmSchema,
	})

	if (submission.status !== 'success') {
		return {
			...submission.reply(),
			serializedTransaction: undefined,
			poolId: undefined,
		}
	}

	const { payerKey, mint1, mint2, feeTierId, initialPrice } = submission.value

	const raydium = await initSdk({ owner: payerKey })

	const { transaction, poolId } = await createPool({
		raydium,
		mint1,
		mint2,
		feeTierId,
		initialPrice,
	})

	const serializedTransaction = transaction.serialize()

	return {
		...submission.reply(),
		serializedTransaction,
		poolId,
	}
}

async function createPool({
	raydium,
	mint1: mint1Key,
	mint2: mint2Key,
	feeTierId,
	initialPrice,
}: {
	raydium: Raydium
	mint1: PublicKey
	mint2: PublicKey
	feeTierId: string
	initialPrice: number
}) {
	const mint1 = await raydium.token.getTokenInfo(mint1Key)
	const mint2 = await raydium.token.getTokenInfo(mint2Key)
	const clmmConfigs = await getClmmConfigs(raydium)

	const clmmConfig = clmmConfigs.find(el => el.id === feeTierId)

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
		initialPrice: new Decimal(initialPrice),
		startTime: new BN(0),
		txVersion,
	})

	return {
		poolId: extInfo.address.id,
		transaction,
	}
}
