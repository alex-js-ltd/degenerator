'use server'

import { parseWithZod } from '@conform-to/zod'
import { CpmmSchema } from '@/app/utils/schemas'
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
	DEVNET_PROGRAM_ID,
} from '@/app/utils/raydium'
import BN from 'bn.js'

export async function cpmm(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: CpmmSchema,
	})

	if (submission.status !== 'success') {
		return {
			...submission.reply(),
			serializedTransaction: undefined,
		}
	}

	const { payerKey, mintA, mintB } = submission.value

	const raydium = await initSdk({ owner: payerKey })

	const { transaction, poolId } = await createPool({
		raydium,
		mintA,
		mintB,
		payerKey,
	})

	return {
		...submission.reply(),
		serializedTransaction: transaction.serialize(),
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

async function createPool({
	raydium,
	mintA: a,
	mintB: b,
	payerKey,
}: {
	raydium: Raydium
	mintA: PublicKey
	mintB: PublicKey
	payerKey: PublicKey
}) {
	const mintA = await raydium.token.getTokenInfo(a)
	const mintB = await raydium.token.getTokenInfo(b)

	const { execute, extInfo, transaction } = await raydium.cpmm.createPool({
		programId: programId[cluster],
		poolFeeAccount: poolFeeAccount[cluster],
		mintA,
		mintB,
		mintAAmount: new BN(100),
		mintBAmount: new BN(100),
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

	extInfo.address.poolFeeAccount
	return { transaction, poolId: extInfo.address.poolId.toBase58() }
}
