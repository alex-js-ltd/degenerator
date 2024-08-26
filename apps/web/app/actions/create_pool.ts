'use server'

import { parseWithZod } from '@conform-to/zod'
import { PoolSchema } from '@/app/utils/schemas'
import { type PublicKey } from '@solana/web3.js'
import {
	type Raydium,
	initSdk,
	txVersion,
	cluster,
	CREATE_CPMM_POOL_PROGRAM,
	DEV_CREATE_CPMM_POOL_PROGRAM,
	CREATE_CPMM_POOL_FEE_ACC,
	DEV_CREATE_CPMM_POOL_FEE_ACC,
	getAmount,
} from '@/app/utils/raydium'
import { BN } from '@coral-xyz/anchor'
import { isError, catchError } from '@/app/utils/misc'

export async function createPool(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: PoolSchema,
	})

	const error = {
		...submission.reply(),
		serializedTransaction: undefined,
		poolId: undefined,
	}

	if (submission.status !== 'success') {
		return error
	}

	const { payer, mintA, mintB, mintAAmount, mintBAmount } = submission.value

	const raydium = await initSdk({ owner: payer }).catch(catchError)

	if (isError(raydium)) return { ...error, message: raydium.message }

	const poolTx = await getPoolTx({
		raydium,
		mintA,
		mintB,
		mintAAmount,
		mintBAmount,
		payer,
	}).catch(catchError)

	if (isError(poolTx)) return { ...error, message: poolTx.message }

	return {
		...submission.reply(),
		serializedTransaction: poolTx.transaction.serialize(),
		poolId: poolTx.poolId,
	}
}

const programId = {
	mainnet: CREATE_CPMM_POOL_PROGRAM,
	devnet: DEV_CREATE_CPMM_POOL_PROGRAM,
}

const poolFeeAccount = {
	mainnet: CREATE_CPMM_POOL_FEE_ACC,
	devnet: DEV_CREATE_CPMM_POOL_FEE_ACC,
}

async function getPoolTx({
	raydium,
	mintA: a,
	mintB: b,
	mintAAmount,
	mintBAmount,
	payer,
}: {
	raydium: Raydium
	mintA: PublicKey
	mintB: PublicKey
	mintAAmount: number
	mintBAmount: number
	payer: PublicKey
}) {
	const mintA = await raydium.token.getTokenInfo(a)
	const mintB = await raydium.token.getTokenInfo(b)

	const { execute, extInfo, transaction } = await raydium.cpmm.createPool({
		programId: programId[cluster],
		poolFeeAccount: poolFeeAccount[cluster],
		mintA,
		mintB,
		mintAAmount: getAmount(mintAAmount, mintA.decimals),
		mintBAmount: getAmount(mintBAmount, mintB.decimals),
		startTime: new BN(0),
		associatedOnly: false,
		ownerInfo: {
			useSOLBalance: true,
			feePayer: payer,
		},
		txVersion,
		// optional: set up priority fee here
		// computeBudgetConfig: {
		//   units: 600000,
		//   microLamports: 100000000,
		// },
	})

	return { transaction, poolId: extInfo.address.poolId.toBase58() }
}
