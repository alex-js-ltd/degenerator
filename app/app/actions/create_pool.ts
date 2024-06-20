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
} from '@solana/web3.js'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'
import DLMM, { BinLiquidity, LbPosition, StrategyType } from '@meteora-ag/dlmm'
import BN from 'bn.js'

import invariant from 'tiny-invariant'

const { CLUSTER } = getEnv()

const devnetPool = new PublicKey('3W2HKgUa96Z69zzG3LK1g8KdcRAWzAttiLiHfYnKuPw5')

/** Utils */
export interface ParsedClockState {
	info: {
		epoch: number
		epochStartTimestamp: number
		leaderScheduleEpoch: number
		slot: number
		unixTimestamp: number
	}
	type: string
	program: string
	space: number
}

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
	const totalXAmount = new BN(1)
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
			encoded_transaction: undefined,
		}
	}

	const { owner } = submission.value

	const dlmmPool = await DLMM.create(connection, devnetPool, {
		cluster: 'devnet',
	})

	await getActiveBin(dlmmPool)
	const transaction = await createBalancePosition(dlmmPool, {
		publicKey: owner,
	})

	const blockHash = (await connection.getLatestBlockhash('finalized')).blockhash
	transaction.feePayer = owner
	transaction.recentBlockhash = blockHash
	transaction.partialSign(newBalancePosition)
	const serializedTransaction = transaction.serialize({
		requireAllSignatures: false,
		verifySignatures: true,
	})

	const transactionBase64 = serializedTransaction.toString('base64')

	return {
		...submission.reply(),
		encoded_transaction: transactionBase64,
	}
}
