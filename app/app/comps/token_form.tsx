'use client'

import { type ReactNode, Fragment } from 'react'
import { useFormState } from 'react-dom'

import {
	useForm,
	getFormProps,
	getInputProps,
	FormProvider,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { Schema } from '@/app/utils/schemas'
import { mintToken } from '@/app/actions/mint_token'
import { createPool } from '@/app/actions/create_pool'
import { deposit } from '@/app/actions/deposit'

import { usePayer } from '@/app/hooks/use_payer'

import { useMintTx, usePoolTx, useDepositTx } from '@/app/context/tx_context'
import { ImageChooser } from '@/app/comps/image_chooser'
import { PreviewImage } from '@/app/comps/preview_image'
import { Field } from '@/app/comps/field'
import { Input } from '@/app/comps/input'
import { SubmitButton } from '@/app/comps/submit_button'
import { CpmmCheckbox } from '@/app/comps/checkbox'
import { ResetButton } from '@/app/comps/reset_button'
import { useServerAction } from '@/app/hooks/use_server_action'

const initialMint = {
	serializedTransaction: undefined,
	mintA: undefined,
}

const initialPool = {
	serializedTransaction: undefined,
	poolId: undefined,
}

const initialDeposit = {
	serializedTransaction: undefined,
}

export function TokenForm({ children }: { children: ReactNode }) {
	const [lastMint, mintAction] = useFormState(mintToken, initialMint)
	const [lastPool, poolAction] = useFormState(createPool, initialPool)
	const [lastDeposit, depositAction] = useFormState(deposit, initialDeposit)

	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate: ({ formData }) => parseWithZod(formData, { schema: Schema }),

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		lastResult: lastMint,
		defaultValue: {
			cpmm: 'on',
		},
	})

	const { mintA, serializedTransaction: mintTx } = lastMint
	const { poolId, serializedTransaction: poolTx } = lastPool
	const { serializedTransaction: depositTx } = lastDeposit

	const { data: mintTxSig } = useMintTx(mintTx)
	const { data: poolTxSig } = usePoolTx(poolTx)
	useDepositTx(depositTx)

	const getPoolProps = useServerAction(poolAction, mintTxSig)
	const getDepositProps = useServerAction(depositAction, poolTxSig)

	const payer = usePayer()
	const showCpmm = fields.cpmm.value === 'on'

	return (
		<div className="relative z-10 m-auto flex w-full flex-col divide-zinc-600 overflow-hidden rounded-xl bg-gray-900 shadow-lg shadow-black/40 sm:max-w-xl">
			<FormProvider context={form.context}>
				<PreviewImage />

				<div className="absolute top-2.5 right-10 p-1 w-5 h-5">
					<ResetButton />
				</div>

				<div className="absolute right-3.5 top-2.5 z-10 p-1 w-5 h-5">
					<CpmmCheckbox />
				</div>

				<form
					className="relative z-10 h-full w-full min-w-0 bg-gray-900"
					{...getFormProps(form)}
				>
					<fieldset className="relative flex w-full flex-1 items-center transition-all duration-300 flex-col gap-6">
						<div className="relative grid grid-cols-1 sm:grid-cols-4 w-full">
							<Field
								inputProps={{
									...getInputProps(fields.name, { type: 'text' }),
									placeholder: 'Name',
								}}
								errors={fields.name.errors}
							/>
							<Field
								inputProps={{
									...getInputProps(fields.symbol, { type: 'text' }),
									placeholder: 'Symbol',
								}}
								errors={fields.symbol.errors}
							/>
							<Field
								inputProps={{
									...getInputProps(fields.decimals, { type: 'text' }),
									placeholder: 'Decimals',
								}}
								errors={fields.decimals.errors}
							/>
							<Field
								inputProps={{
									...getInputProps(fields.supply, { type: 'text' }),
									placeholder: 'Supply',
								}}
								errors={fields.supply.errors}
							/>
							<Field
								inputProps={{
									...getInputProps(fields.description, { type: 'text' }),
									placeholder: 'Description',
									className: 'sm:col-span-4 w-full',
								}}
								errors={fields.description.errors}
							/>

							<Input
								{...getInputProps(fields.payerKey, { type: 'hidden' })}
								defaultValue={payer}
							/>

							<Input
								{...getInputProps(fields.mintA, { type: 'hidden' })}
								defaultValue={mintA}
							/>

							<Input
								{...getInputProps(fields.poolId, { type: 'hidden' })}
								defaultValue={poolId}
							/>

							<input name="amount" defaultValue={0.1} type="hidden" />
						</div>

						<div className="flex items-end w-full gap-2 p-3 h-[69px]">
							<div className="flex flex-1 gap-1 sm:gap-2">
								<ImageChooser />
								{showCpmm && children}
							</div>

							<SubmitButton
								form={form.id}
								formAction={mintAction}
								content="Submit"
							/>

							{showCpmm && <button {...getPoolProps()} />}
							{showCpmm && poolId && <button {...getDepositProps()} />}
						</div>
					</fieldset>
				</form>
			</FormProvider>
		</div>
	)
}
