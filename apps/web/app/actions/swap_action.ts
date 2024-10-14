'use server'

import { SubmissionResult } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { SwapSchema } from '@/app/utils/schemas'
import { program, connection } from '@/app/utils/setup'
import {
	getBuyTokenIx,
	getSellTokenIx,
	buildTransaction,
} from '@repo/degenerator'

export interface State {
	lastResult?: SubmissionResult<string[]>
	data?: { serializedTransaction: Uint8Array }
}

export async function swapAction(_prevState: State, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: SwapSchema,
	})

	if (submission.status !== 'success') {
		return {
			lastResult: submission.reply(),
		}
	}

	const { buy, payer, mint, amount, decimals } = submission.value

	const ix = buy
		? await getBuyTokenIx({
				program,
				payer,
				mint,
				uiAmount: amount,
				decimals,
			})
		: await getSellTokenIx({
				program,
				payer,
				mint,
				uiAmount: amount,
				decimals,
			})

	const transaction = await buildTransaction({
		connection,
		payer,
		instructions: [ix],
		signers: [],
	})

	return {
		lastResult: submission.reply(),
		data: { serializedTransaction: transaction.serialize() },
	}
}
