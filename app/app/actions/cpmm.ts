'use server'

import { parseWithZod } from '@conform-to/zod'
import { CpmmSchema } from '@/app/utils/schemas'
import { type PublicKey } from '@solana/web3.js'
import {
	type Raydium,
	initSdk,
	CREATE_CPMM_POOL_PROGRAM,
	CREATE_CPMM_POOL_FEE_ACC,
	DEVNET_PROGRAM_ID,
	txVersion,
	cluster,
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

	const raydium = await initSdk({ owner: payerKey, loadToken: true })

	const tx = await createPool({ raydium, mintA, mintB })

	return {
		...submission.reply(),
		serializedTransaction: tx.serialize(),
	}
}

async function createPool({
	raydium,
	mintA: a,
	mintB: b,
}: {
	raydium: Raydium
	mintA: PublicKey
	mintB: PublicKey
}) {
	const mintA = await raydium.token.getTokenInfo(a)
	const mintB = await raydium.token.getTokenInfo(b)

	const { execute, extInfo, transaction } = await raydium.cpmm.createPool({
		programId: CREATE_CPMM_POOL_PROGRAM, // devnet: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM
		poolFeeAccount: CREATE_CPMM_POOL_FEE_ACC, // devnet: CREATE_CPMM_POOL_FEE_ACC.CREATE_CPMM_POOL_PROGRAM
		mintA,
		mintB,
		mintAAmount: new BN(100),
		mintBAmount: new BN(100),
		startTime: new BN(0),
		associatedOnly: false,
		ownerInfo: {
			useSOLBalance: true,
		},
		txVersion,
		// optional: set up priority fee here
		// computeBudgetConfig: {
		//   units: 600000,
		//   microLamports: 100000000,
		// },
	})

	return transaction
}
