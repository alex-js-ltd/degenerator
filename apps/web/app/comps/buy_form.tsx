'use client'

import { useActionState } from 'react'

import { useForm, getFormProps, getInputProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { BuySchema } from '@/app/utils/schemas'

import { type State, buyAction } from '@/app/actions/buy_action'

import { usePayer } from '@/app/hooks/use_payer'
import { useBuyTx } from '@/app/context/tx_context'

import { BuyButton } from '@/app/comps/buy_button'

const initialState: State = {
	lastResult: undefined,
	data: undefined,
}

export function BuyForm({ mint }: { mint: string }) {
	const [state, formAction] = useActionState(buyAction, initialState)

	const { lastResult, data } = state

	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate: ({ formData }) => parseWithZod(formData, { schema: BuySchema }),

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		lastResult,
	})

	const { serializedTransaction } = data || {}

	useBuyTx(serializedTransaction)

	const payer = usePayer()

	return (
		<div className="rounded-b-xl">
			<form
				className="has-[:focus-visible]:border-alpha-600 relative rounded-xl border bg-white shadow transition-colors duration-300 ease-in"
				{...getFormProps(form)}
				action={formAction}
			>
				<input name="payer" defaultValue={payer} type="hidden" />
				<input name="mint" defaultValue={mint} type="hidden" />
				<div className="relative z-10 grid rounded-xl bg-white">
					<label className="sr-only" htmlFor="chat-main-textarea">
						Buy input
					</label>
					<textarea
						autoFocus
						placeholder="Amount..."
						rows={1}
						className="resize-none overflow-auto w-full flex-1 bg-transparent p-3 pb-1.5 text-sm outline-none ring-0"
						style={{ minHeight: '42px', maxHeight: '384px', height: '42px' }}
						{...getInputProps(fields.amount, { type: 'text' })}
					/>
					<div className="flex items-center gap-2 p-3">
						<BuyButton />
					</div>
				</div>
			</form>
		</div>
	)
}
