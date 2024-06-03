'use client'

import { useForm, getFormProps, getInputProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { TokenSchema } from '@/app/utils/schemas'
import { useState } from 'react'
import { ImageChooser } from '@/app/comps/image_chooser'
import { PreviewImage } from '@/app/comps/preview_image'
import { Field } from '@/app/comps/field'
import { Input } from '@/app/comps/input'
import { useRef, useCallback, useEffect } from 'react'
import { SubmitButton } from '@/app/comps/submit_button'
import { createSplToken } from '@/app/utils/actions'
import { useFormState } from 'react-dom'
import { useAsync } from '@/app/hooks/use_async'
import { useSendAndConfirmTx } from '@/app/hooks/use_send_and_confirm_tx'
import { useSerializedTx } from '@/app/hooks/use_serialized_tx'
import { usePayer } from '@/app/hooks/use_payer'

const initialState = {
	serializedTransaction: undefined,
}

export default function Page() {
	const [lastResult, action] = useFormState(createSplToken, initialState)

	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: TokenSchema })
		},

		// Validate the form on blur event triggered
		shouldValidate: 'onInput',

		shouldRevalidate: 'onBlur',

		lastResult,
	})

	const [previewImage, setPreviewImage] = useState<string | undefined>(
		undefined,
	)

	const fileRef = useRef<HTMLInputElement>(null)

	const clearPreviewImage = useCallback(() => {
		if (fileRef.current) {
			fileRef.current.value = ''
			setPreviewImage(undefined)
		}
	}, [])

	const payer = usePayer()

	const { serializedTransaction } = lastResult

	const transaction = useSerializedTx({ serializedTransaction })

	const { run, isLoading } = useAsync()

	const sendAndConfirmTx = useSendAndConfirmTx()

	useEffect(() => {
		if (!transaction) return

		run(sendAndConfirmTx(transaction))
	}, [run, sendAndConfirmTx, transaction])

	return (
		<div className="z-10 m-auto flex w-full flex-col divide-zinc-600 overflow-hidden rounded-xl bg-gray-900 shadow-lg shadow-black/40 sm:max-w-xl">
			<PreviewImage
				src={previewImage}
				clearPreviewImage={clearPreviewImage}
				errors={fields.image.errors}
			/>

			<form
				className="relative z-10 h-full w-full min-w-0 bg-gray-900 py-5"
				{...getFormProps(form)}
				action={action}
			>
				<div className="relative flex w-full flex-1 items-center transition-all duration-300 flex-col gap-6">
					<div className="relative grid grid-cols-1 sm:grid-cols-4 w-full">
						<Field
							inputProps={{
								...getInputProps(fields.name, {
									type: 'text',
								}),
								placeholder: 'Name',
							}}
							errors={fields.name.errors}
						/>

						<Field
							inputProps={{
								...getInputProps(fields.symbol, {
									type: 'text',
								}),
								placeholder: 'Symbol',
							}}
							errors={fields.symbol.errors}
						/>

						<Field
							inputProps={{
								...getInputProps(fields.decimals, {
									type: 'number',
								}),
								placeholder: 'Decimals',
								min: 0,
								max: 9,
							}}
							errors={fields.decimals.errors}
						/>

						<Field
							inputProps={{
								...getInputProps(fields.supply, {
									type: 'number',
								}),
								placeholder: 'Supply',
								min: 1,
							}}
							errors={fields.supply.errors}
						/>

						<Field
							inputProps={{
								...getInputProps(fields.description, {
									type: 'text',
								}),
								placeholder: 'Description',
								className: 'sm:col-span-4 w-full',
							}}
							errors={fields.description.errors}
						/>

						<Input
							{...getInputProps(fields.payer, {
								type: 'hidden',
							})}
							defaultValue={payer}
						/>
					</div>

					<div className="flex w-full gap-2 px-3 md:px-4">
						<div className="flex flex-1 gap-1 sm:gap-2">
							<ImageChooser
								name={fields.image.name}
								setPreviewImage={setPreviewImage}
								fileRef={fileRef}
							/>
						</div>

						<SubmitButton isLoading={isLoading} />
					</div>
				</div>
			</form>
		</div>
	)
}
