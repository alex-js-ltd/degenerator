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
	getAmount,
} from '@/app/utils/raydium'
import { isError } from '@/app/utils/misc'

export async function deposit(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: DepositSchema,
	})

	const error = {
		...submission.reply(),
		serializedTransaction: undefined,
	}
	if (submission.status !== 'success') {
		return error
	}

	const { payerKey, poolId, amount } = submission.value

	const raydium = await initSdk({ owner: payerKey }).catch(err => ({
		message: 'failed to init raydium',
	}))

	if (isError(raydium)) return { ...error, message: raydium.message }

	const depositTx = await getDepositTx({ raydium, poolId, amount }).catch(
		err => ({
			message: 'failed to get deposit tx',
		}),
	)

	if (isError(depositTx)) return { ...error, message: depositTx.message }

	const { transaction } = depositTx

	return {
		...submission.reply(),
		serializedTransaction: transaction.serialize(),
	}
}

async function getDepositTx({
	raydium,
	poolId,
	amount,
}: {
	raydium: Raydium
	poolId: string
	amount: number
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

	const inputAmount = getAmount(amount, poolInfo.mintA.decimals)

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
