'use client'

import { ReactNode, useActionState, useState } from 'react'

import { useForm, FormProvider, getFormProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { SwapSchema } from '@/app/utils/schemas'
import { type State, swapAction } from '@/app/actions/swap_action'
import { usePayer } from '@/app/hooks/use_payer'
import { useSwapTx } from '@/app/context/tx_context'
import { SwapButton } from '@/app/comps/swap_button'
import { SwapSwitch } from '@/app/comps/swap_switch'
import { useBondingCurveState } from '@/app/hooks/use_bonding_curve_state'
import { fetchBondingCurveState } from '@repo/degenerator'
import { Pill } from './pill'
import { TokenLogo } from './token_logo'
import { useSwapEvent } from '@/app/hooks/use_swap_event'

const initialState: State = {
	lastResult: undefined,
	data: undefined,
}

type CurveState = Omit<
	Awaited<ReturnType<typeof fetchBondingCurveState>>,
	'currentSupply' | 'reserveBalance' | 'mint'
> & {
	currentSupply: string
	reserveBalance: string
	mint: string
}

export interface SwapFormProps {
	pill: ReactNode
	curve: CurveState
}

export function SwapForm({ pill, curve }: SwapFormProps) {
	const [state, formAction] = useActionState(swapAction, initialState)

	const { lastResult, data } = state

	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: SwapSchema }),

		onSubmit(e, { formData }) {},

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

	const [buy, setBuy] = useState(true)

	function onCheckedChange(checked: boolean) {
		setBuy(checked)
	}

	function getPlaceholder(decimals: number) {
		return {
			placeholder: '0.' + '0'.repeat(decimals),
		}
	}

	let decimals = buy ? 9 : curve.mintDecimals

	useSwapEvent(curve.mint)

	return (
		<FormProvider context={form.context}>
			<div className="rounded-b-xl w-full">
				<form
					className="has-[:focus-visible]:border-alpha-600 relative rounded-xl border bg-white shadow transition-colors"
					action={formAction}
					{...getFormProps(form)}
				>
					<span className="absolute top-3 right-3 z-50 text-teal-300 text-xs"></span>
					<input name="payer" defaultValue={payer} type="hidden" />
					<input name="mint" defaultValue={curve.mint} type="hidden" />
					<input name="decimals" defaultValue={decimals} type="hidden" />
					<div className="relative z-10 grid rounded-xl bg-white">
						<label className="sr-only" htmlFor="swap-input">
							Swap input
						</label>
						<input
							type="number"
							name="amount"
							className="h-[42px] resize-none overflow-auto w-full flex-1 bg-transparent p-3 pb-1.5 text-sm outline-none ring-0"
							{...getPlaceholder(decimals)}
						/>
						<div className="flex items-center gap-2 p-3">
							<Pill variant="swap">
								<TokenLogo
									src="https://img-v1.raydium.io/icon/So11111111111111111111111111111111111111112.png"
									alt="sol"
								/>
								<div className="w-fit">SOL</div>
							</Pill>
							{pill}

							<SwapSwitch
								name="buy"
								checked={buy}
								onCheckedChange={onCheckedChange}
							/>
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
