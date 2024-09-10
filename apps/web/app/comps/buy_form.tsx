'use client'

import { useActionState } from 'react'

import { useForm, getFormProps, getInputProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { BuySchema } from '@/app/utils/schemas'

import { type State, buyAction } from '@/app/actions/buy_action'

import { usePayer } from '@/app/hooks/use_payer'
import { useBuyTx } from '@/app/context/tx_context'

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
						<button
							className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:pointer-events-none disabled:cursor-not-allowed bg-gray-100 text-gray-400 disabled:ring-0 has-[:focus-visible]:ring-2 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 disabled:border-alpha-400 border-alpha-600 hover:bg-gray-200  h-8 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] rounded-lg ml-auto"
							type="submit"
						>
							<svg
								height={16}
								strokeLinejoin="round"
								viewBox="0 0 16 16"
								width={16}
								style={{ color: 'currentColor' }}
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M8.70711 1.39644C8.31659 1.00592 7.68342 1.00592 7.2929 1.39644L2.21968 6.46966L1.68935 6.99999L2.75001 8.06065L3.28034 7.53032L7.25001 3.56065V14.25V15H8.75001V14.25V3.56065L12.7197 7.53032L13.25 8.06065L14.3107 6.99999L13.7803 6.46966L8.70711 1.39644Z"
									fill="currentColor"
								></path>
							</svg>
							Buy
						</button>
					</div>
				</div>
			</form>
		</div>
	)
}
