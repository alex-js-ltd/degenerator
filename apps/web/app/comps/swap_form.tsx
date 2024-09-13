'use client'

import { ReactNode, useActionState } from 'react'

import { useForm, getFormProps, FormProvider } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { SwapSchema } from '@/app/utils/schemas'
import { type State, swapAction } from '@/app/actions/swap_action'
import { usePayer } from '@/app/hooks/use_payer'
import { useSwapTx } from '@/app/context/tx_context'
import { SwapButton } from '@/app/comps/swap_button'
import { useInputControl } from '@conform-to/react'
import { getControlProps } from '@/app/utils/misc'
import { SwapSwitch } from '@/app/comps/swap_switch'

const initialState: State = {
	lastResult: undefined,
	data: undefined,
}

export function SwapForm({ mint, token }: { mint: string; token: ReactNode }) {
	const [state, formAction] = useActionState(swapAction, initialState)

	const { lastResult, data } = state

	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: SwapSchema }),

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		lastResult,

		defaultValue: {
			amount: '',
		},
	})

	const { serializedTransaction } = data || {}

	useSwapTx(serializedTransaction)

	const payer = usePayer()

	const control = useInputControl(fields.amount)

	return (
		<FormProvider context={form.context}>
			<div className="rounded-b-xl">
				<form
					className="has-[:focus-visible]:border-alpha-600 relative rounded-xl border bg-white shadow transition-colors"
					{...getFormProps(form)}
					action={formAction}
				>
					<input name="payer" defaultValue={payer} type="hidden" />
					<input name="mint" defaultValue={mint} type="hidden" />
					<div className="relative z-10 grid rounded-xl bg-white">
						<label className="sr-only" htmlFor="chat-main-textarea">
							Swap input
						</label>
						<input
							placeholder="Amount…"
							className="resize-none overflow-auto w-full flex-1 bg-transparent p-3 pb-1.5 text-sm outline-none ring-0"
							style={{ minHeight: '42px', maxHeight: '384px', height: '42px' }}
							{...getControlProps(control)}
						/>
						<div className="flex items-center gap-2 p-3">
							{token}

							<SwapSwitch />
							<div className="ml-auto flex items-center gap-2">
								<SwapButton />
							</div>
						</div>
					</div>
				</form>
			</div>
		</FormProvider>
	)
}
