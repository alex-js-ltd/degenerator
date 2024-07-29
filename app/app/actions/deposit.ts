'use server'

import { parseWithZod } from '@conform-to/zod'
import { DepositSchema } from '@/app/utils/schemas'

import {
	type Raydium,
	initSdk,
	txVersion,
	ApiV3PoolInfoStandardItemCpmm,
	CpmmKeys,
	Percent,
	isValidCpmm,
} from '@/app/utils/raydium'
import { BN } from '@coral-xyz/anchor'
import Decimal from 'decimal.js'

export async function deposit(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: DepositSchema,
	})

	if (submission.status !== 'success') {
		return {
			...submission.reply(),
			serializedTransaction: undefined,
		}
	}

	const { payerKey, poolId } = submission.value

	const raydium = await initSdk({ owner: payerKey })

	const { transaction } = await getDepositTx({ raydium, poolId })

	return {
		...submission.reply(),
		serializedTransaction: transaction.serialize(),
	}
}

async function getDepositTx({
	raydium,
	poolId,
}: {
	raydium: Raydium
	poolId: string
}) {
	let poolInfo: ApiV3PoolInfoStandardItemCpmm
	let poolKeys: CpmmKeys | undefined

	if (raydium.cluster === 'mainnet') {
		// note: api doesn't support get devnet pool info, so in devnet else we go rpc method
		// if you wish to get pool info from rpc, also can modify logic to go rpc method directly
		const data = await raydium.api.fetchPoolById({ ids: poolId })
		poolInfo = data[0] as ApiV3PoolInfoStandardItemCpmm
		if (!isValidCpmm(poolInfo.programId))
			throw new Error('target pool is not CPMM pool')
	} else {
		const data = await raydium.cpmm.getPoolInfoFromRpc(poolId)
		poolInfo = data.poolInfo
		poolKeys = data.poolKeys
	}

	const uiInputAmount = '0.0001'
	const inputAmount = new BN(
		new Decimal(uiInputAmount).mul(10 ** poolInfo.mintA.decimals).toFixed(0),
	)
	const slippage = new Percent(1, 100) // 1%
	const baseIn = true

	const { execute, transaction } = await raydium.cpmm.addLiquidity({
		poolInfo,
		poolKeys,
		inputAmount,
		slippage,
		baseIn,
		txVersion,
		// optional: set up priority fee here
		// computeBudgetConfig: {
		//   units: 600000,
		//   microLamports: 100000000,
		// },
	})

	return { transaction }
}
