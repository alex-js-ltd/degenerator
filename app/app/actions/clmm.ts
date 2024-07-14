'use server'

import { parseWithZod } from '@conform-to/zod'
import { ClmmSchema } from '@/app/utils/schemas'
import invariant from 'tiny-invariant'
import { connection } from '@/app/utils/setup'
import { BN } from '@coral-xyz/anchor'

import { PublicKey } from '@solana/web3.js'

import {
	Raydium,
	TxVersion,
	CLMM_PROGRAM_ID,
	DEVNET_PROGRAM_ID,
	type ClmmKeys,
} from '@raydium-io/raydium-sdk-v2'
import Decimal from 'decimal.js'

import { getEnv } from '@/app/utils/env'
import { getClmmConfigs } from '@/app/utils/clmm'
import { initSdk, fetchTokenAccountData } from '@/app/utils/raydium'

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
		}
	}

	const { payerKey, mint1, mint2, feeTier } = submission.value

	const raydium = await initSdk({ owner: payerKey })

	raydium.account.updateTokenAccount(
		await fetchTokenAccountData({ connection, owner: payerKey }),
	)
	connection.onAccountChange(payerKey, async () => {
		raydium.account.updateTokenAccount(
			await fetchTokenAccountData({ connection, owner: payerKey }),
		)
	})

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
