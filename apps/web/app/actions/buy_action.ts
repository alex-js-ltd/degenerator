'use server'

import { SubmissionResult } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { BuySchema } from '@/app/utils/schemas'
import { program, connection } from '@/app/utils/setup'
import { getBuyTokenInstruction, buildTransaction } from '@repo/degenerator'

export type State = {
	lastResult?: SubmissionResult<string[]>
	data?: { serializedTransaction: Uint8Array }
}

export async function buyAction(_prevState: State, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: BuySchema,
	})

	if (submission.status !== 'success') {
		return {
			lastResult: submission.reply(),
		}
	}

	const { payer, mint, amount } = submission.value

	const ix = await getBuyTokenInstruction({ program, payer, mint, amount })

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
