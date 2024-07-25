'use server'

import { parseWithZod } from '@conform-to/zod'
import { ClmmSchema } from '@/app/utils/schemas'
import invariant from 'tiny-invariant'
import { BN } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import Decimal from 'decimal.js'
import {
	Raydium,
	initSdk,
	getClmmConfigs,
	CREATE_CPMM_POOL_PROGRAM,
	DEV_CREATE_CPMM_POOL_PROGRAM,
	cluster,
	txVersion,
} from '@/app/utils/raydium'

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

const programId = {
	mainnet: CREATE_CPMM_POOL_PROGRAM,
	devnet: DEV_CREATE_CPMM_POOL_PROGRAM,
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

	const { builder, extInfo, transaction } = await raydium.clmm.createPool({
		programId: programId[cluster],
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
