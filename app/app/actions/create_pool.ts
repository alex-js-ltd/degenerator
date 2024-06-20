'use server'

import { parseWithZod } from '@conform-to/zod'
import { PoolSchema } from '@/app/utils/schemas'
import { program, connection } from '@/app/utils/setup'
import { getEnv } from '@/app/utils/env'

import {
	Connection,
	Keypair,
	PublicKey,
	sendAndConfirmTransaction,
	SYSVAR_CLOCK_PUBKEY,
	ParsedAccountData,
	Transaction,
	VersionedTransaction,
	TransactionMessage,
} from '@solana/web3.js'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'
import DLMM, { BinLiquidity, LbPosition, StrategyType } from '@meteora-ag/dlmm'
import BN from 'bn.js'

import invariant from 'tiny-invariant'

const { CLUSTER } = getEnv()

const devnetPool = new PublicKey('3W2HKgUa96Z69zzG3LK1g8KdcRAWzAttiLiHfYnKuPw5')

const newBalancePosition = new Keypair()

async function getActiveBin(dlmmPool: DLMM) {
	// Get pool state
	let activeBin = await dlmmPool.getActiveBin()
	console.log('🚀 ~ activeBin:', activeBin)
	return activeBin
}

// To create a balance deposit position
async function createBalancePosition(
	dlmmPool: DLMM,
	user: { publicKey: PublicKey },
) {
	const activeBin = await getActiveBin(dlmmPool)
	const TOTAL_RANGE_INTERVAL = 10 // 10 bins on each side of the active bin
	const minBinId = activeBin.binId - TOTAL_RANGE_INTERVAL
	const maxBinId = activeBin.binId + TOTAL_RANGE_INTERVAL

	const activeBinPricePerToken = dlmmPool.fromPricePerLamport(
		Number(activeBin.price),
	)
	const totalXAmount = new BN(0.6)
	const totalYAmount = totalXAmount.mul(new BN(Number(activeBinPricePerToken)))

	// Create Position
	const createPositionTx =
		await dlmmPool.initializePositionAndAddLiquidityByStrategy({
			positionPubKey: newBalancePosition.publicKey,
			user: user.publicKey,
			totalXAmount,
			totalYAmount,
			strategy: {
				maxBinId,
				minBinId,
				strategyType: StrategyType.SpotBalanced,
			},
		})

	return createPositionTx
}

export async function createPool(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: PoolSchema,
	})

	if (submission.status !== 'success') {
		return {
			...submission.reply(),
			serializedTransaction: undefined,
		}
	}

	const { owner } = submission.value

	const dlmmPool = await DLMM.create(connection, devnetPool, {
		cluster: 'devnet',
	})

	await getActiveBin(dlmmPool)
	const leg = await createBalancePosition(dlmmPool, {
		publicKey: owner,
	})

	let blockhash = await connection
		.getLatestBlockhash()
		.then(res => res.blockhash)

	const instructions = leg.instructions

	const messageV0 = new TransactionMessage({
		payerKey: owner,
		recentBlockhash: blockhash,
		instructions,
	}).compileToV0Message()

	const transaction = new VersionedTransaction(messageV0)

	transaction.sign([newBalancePosition])

	const serializedTransaction = transaction.serialize()

	return {
		...submission.reply(),
		serializedTransaction,
	}
}
