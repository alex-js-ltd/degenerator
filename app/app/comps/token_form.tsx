'use client'

import { type ReactNode } from 'react'
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

import { usePayer } from '@/app/hooks/use_payer'

import { useMintTx } from '@/app/context/tx_context'
import { ImageChooser } from '@/app/comps/image_chooser'
import { PreviewImage } from '@/app/comps/preview_image'
import { Field } from '@/app/comps/field'
import { Input } from '@/app/comps/input'
import { SubmitButton } from '@/app/comps/submit_button'
import { CpmmCheckbox } from '@/app/comps/checkbox'
import { ResetButton } from '@/app/comps/reset_button'
import { PoolAction } from '@/app/comps/pool_action'
import { useServerAction } from '@/app/hooks/use_server_action'
import { createPool } from '@/app/actions/create_pool'

const initialMintState = {
	serializedTransaction: undefined,
	mintA: undefined,
}

const initialPoolState = {
	serializedTransaction: undefined,
	poolId: undefined,
}

export function TokenForm({ children }: { children: ReactNode }) {
	const [lastResult, action] = useFormState(mintToken, initialMintState)

	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate: ({ formData }) => parseWithZod(formData, { schema: Schema }),

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		lastResult,
		defaultValue: {
			cpmm: 'on',
		},
	})

	const { mintA, serializedTransaction: tx } = lastResult
	useMintTx(tx)

	const payer = usePayer()
	const showCpmm = fields.cpmm.value === 'on'

	const { getButtonProps } = useServerAction(
		createPool,
		initialPoolState,
		false,
	)

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
						</div>

						<div className="flex items-end w-full gap-2 p-3 h-[69px]">
							<div className="flex flex-1 gap-1 sm:gap-2">
								<ImageChooser />
								{showCpmm && children}
							</div>

							<SubmitButton
								form={form.id}
								formAction={action}
								content="Submit"
							/>

							{showCpmm && <button {...getButtonProps()} />}
						</div>
					</fieldset>
				</form>
			</FormProvider>
		</div>
	)
}
