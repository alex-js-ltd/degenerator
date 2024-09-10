'use server'

import { SubmissionResult } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { SellSchema } from '@/app/utils/schemas'
import { program, connection } from '@/app/utils/setup'
import { getSellTokenInstruction, buildTransaction } from '@repo/degenerator'

export type State = {
	lastResult?: SubmissionResult<string[]>
	data?: { serializedTransaction: Uint8Array }
}

export async function sellAction(_prevState: State, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: SellSchema,
	})

	if (submission.status !== 'success') {
		return {
			lastResult: submission.reply(),
		}
	}

	const { payer, mint, amount } = submission.value

	const ix = await getSellTokenInstruction({ program, payer, mint, amount })

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
