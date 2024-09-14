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
import { usePricePerToken } from '@/app/hooks/use_price_per_token'
import { BN } from '@coral-xyz/anchor'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

function getTotalPrice(pricePerToken?: BN, amount?: string): string {
	if (!pricePerToken || !amount) return '0'

	const amountBN = new BN(amount || 0)
	const totalPriceInLamports = pricePerToken.mul(amountBN) // Total price in lamports

	// Divide the total lamports by LAMPORTS_PER_SOL (BN) to get the price in SOL (as BN with integer precision)
	const LAMPORTS_PER_SOL_BN = new BN(LAMPORTS_PER_SOL)
	const totalPriceInSOLBN = totalPriceInLamports.div(LAMPORTS_PER_SOL_BN)

	// Get the remainder (for fractional SOL) and divide to add decimal precision
	const remainder = totalPriceInLamports.mod(LAMPORTS_PER_SOL_BN)
	const fractionalSOL = remainder.toNumber() / LAMPORTS_PER_SOL

	// Return the total price in SOL, combining the integer part and fractional part
	return (
		totalPriceInSOLBN.toString() + '.' + fractionalSOL.toFixed(9).split('.')[1]
	)
}

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
		shouldValidate: 'onInput',
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

	const res = usePricePerToken(mint)

	return (
		<FormProvider context={form.context}>
			<div className="rounded-b-xl w-full sm:max-w-xl">
				<form
					className="has-[:focus-visible]:border-alpha-600 relative rounded-xl border bg-white shadow transition-colors"
					{...getFormProps(form)}
					action={(formData: FormData) => {
						formAction(formData)
					}}
				>
					<span className="absolute top-3 right-3 z-50 text-teal-300 text-xs">
						{`${getTotalPrice(res.data?.pricePerToken, control.value)} SOL`}
					</span>
					<input name="payer" defaultValue={payer} type="hidden" />
					<input name="mint" defaultValue={mint} type="hidden" />
					<div className="relative z-10 grid rounded-xl bg-white">
						<label className="sr-only" htmlFor="chat-main-textarea">
							Swap input
						</label>
						<input
							type="number"
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
