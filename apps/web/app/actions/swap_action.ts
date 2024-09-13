'use server'

import { SubmissionResult } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { SwapSchema } from '@/app/utils/schemas'
import { program, connection } from '@/app/utils/setup'
import {
	getBuyTokenInstruction,
	getSellTokenInstruction,
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

	const { buy, payer, mint, amount } = submission.value

	console.log(submission)

	const ix = buy
		? await getBuyTokenInstruction({ program, payer, mint, amount })
		: await getSellTokenInstruction({ program, payer, mint, amount })

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
