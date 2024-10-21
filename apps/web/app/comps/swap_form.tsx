'use client'

import { ReactNode, useActionState } from 'react'

import { useForm, FormProvider, getFormProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { SwapSchema } from '@/app/utils/schemas'
import { type State, swapAction } from '@/app/actions/swap_action'
import { usePayer } from '@/app/hooks/use_payer'
import { useSwapTx } from '@/app/context/tx_context'
import { SwapButton } from '@/app/comps/swap_button'
import { useInputControl } from '@conform-to/react'
import { getControlProps } from '@/app/utils/misc'
import { SwapSwitch } from '@/app/comps/swap_switch'
import { useBondingCurveState } from '@/app/hooks/use_bonding_curve_state'
import { fetchBondingCurveState } from '@repo/degenerator'
import { calculateSolPrice } from '@/app/utils/misc'
import invariant from 'tiny-invariant'
import { Pill } from './pill'
import { TokenLogo } from './token_logo'

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

	const [form, { amount, buy }] = useForm({
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
			buy: true,
		},
	})

	const { serializedTransaction } = data || {}

	useSwapTx(serializedTransaction)

	const payer = usePayer()

	const control = useInputControl(amount)

	const {
		mint,
		currentSupply,
		reserveBalance,
		mintDecimals,
		basePrice,
		slope,
	} = curve || {}

	function getPlaceholder(decimals: number) {
		return {
			placeholder: '0.' + '0'.repeat(decimals),
		}
	}
	console.log(curve)
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
					<input name="mint" defaultValue={mint} type="hidden" />
					<input name="decimals" defaultValue={mintDecimals} type="hidden" />
					<div className="relative z-10 grid rounded-xl bg-white">
						<label className="sr-only" htmlFor="swap-input">
							Swap input
						</label>
						<input
							type="number"
							className="h-[42px] resize-none overflow-auto w-full flex-1 bg-transparent p-3 pb-1.5 text-sm outline-none ring-0"
							{...getControlProps(control)}
							{...getPlaceholder(mintDecimals)}
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

							<SwapSwitch meta={buy} />
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
