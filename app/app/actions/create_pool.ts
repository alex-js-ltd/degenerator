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
} from '@/app/utils/raydium'
import { BN } from '@coral-xyz/anchor'

export async function createPool(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: PoolSchema,
	})

	if (submission.status !== 'success') {
		return {
			...submission.reply(),
			serializedTransaction: undefined,
			poolId: undefined,
		}
	}

	const { payerKey, mintA, mintB, mintAAmount, mintBAmount } = submission.value

	const raydium = await initSdk({ owner: payerKey })

	const { transaction, poolId } = await getPoolTx({
		raydium,
		mintA,
		mintB,
		mintAAmount,
		mintBAmount,
		payerKey,
	})

	return {
		...submission.reply(),
		serializedTransaction: transaction.serialize(),
		poolId,
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
	payerKey,
}: {
	raydium: Raydium
	mintA: PublicKey
	mintB: PublicKey
	mintAAmount: number
	mintBAmount: number
	payerKey: PublicKey
}) {
	const mintA = await raydium.token.getTokenInfo(a)
	const mintB = await raydium.token.getTokenInfo(b)

	const { execute, extInfo, transaction } = await raydium.cpmm.createPool({
		programId: programId[cluster],
		poolFeeAccount: poolFeeAccount[cluster],
		mintA,
		mintB,
		mintAAmount: new BN(mintAAmount),
		mintBAmount: new BN(mintBAmount),
		startTime: new BN(0),
		associatedOnly: false,
		ownerInfo: {
			useSOLBalance: true,
			feePayer: payerKey,
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
