'use client'

import { useActionState } from 'react'

import {
	useForm,
	getFormProps,
	getInputProps,
	FormProvider,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { MintSchema } from '@/app/utils/schemas'
import { type State, initializeAction } from '@/app/actions/initialize_action'

import { usePayer } from '@/app/hooks/use_payer'
import { useInitializeTx } from '@/app/context/tx_context'

import { ImageChooser } from '@/app/comps/image_chooser'
import { PreviewImage } from '@/app/comps/preview_image'
import { Field } from '@/app/comps/field'
import { Input } from '@/app/comps/input'
import { SubmitButton } from '@/app/comps/submit_button'

import { useImage } from '@/app/context/image_context'
import { useCleanUp } from '@/app/hooks/use_clean_up'

const initialState: State = {
	lastResult: undefined,
	data: undefined,
}

export function InitializeForm() {
	const [state, formAction] = useActionState(initializeAction, initialState)

	const { lastResult, data } = state

	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: MintSchema }),

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		lastResult,
	})

	const { serializedTransaction, mint } = data || {}

	useInitializeTx(serializedTransaction)

	useCleanUp(mint)

	const payer = usePayer()

	const { clearImage } = useImage()

	return (
		<FormProvider context={form.context}>
			<div className="relative z-10 m-auto flex w-full flex-col divide-zinc-600 overflow-hidden rounded-xl bg-gray-900 shadow-lg shadow-black/40 sm:max-w-xl">
				<PreviewImage />

				<form
					className="z-10 h-full w-full min-w-0 bg-gray-900"
					{...getFormProps(form)}
					action={(formData: FormData) => {
						formAction(formData)
						clearImage()
					}}
				>
					<fieldset className="relative flex w-full flex-1 items-center transition-all duration-300 flex-col gap-6">
						<div className="relative grid grid-cols-1 sm:grid-cols-2 w-full">
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
									...getInputProps(fields.description, { type: 'text' }),
									placeholder: 'Description',
									className: 'sm:col-span-4 w-full',
								}}
								errors={fields.description.errors}
							/>
							{/* hidden inputs */}
							<Input name="payer" defaultValue={payer} type="hidden" />
						</div>

						<div className="flex items-end w-full gap-2 p-3 h-[69px]">
							<div className="flex flex-1 gap-2">
								<ImageChooser />
							</div>

							<SubmitButton content="Submit" />
						</div>
					</fieldset>
				</form>
			</div>
		</FormProvider>
	)
}
