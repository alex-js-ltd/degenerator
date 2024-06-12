'use client'

import { useForm, getFormProps, getInputProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { TokenSchema } from '@/app/utils/schemas'
import { useState } from 'react'
import { ImageChooser } from '@/app/comps/image_chooser'
import { PreviewImage } from '@/app/comps/preview_image'
import { Field } from '@/app/comps/field'
import { Input } from '@/app/comps/input'
import { Icon } from '@/app/comps/_icon'
import { Toggle } from '@/app/comps/toggle'
import { useRef, useCallback, useEffect } from 'react'
import { SubmitButton } from '@/app/comps/submit_button'
import { createSplToken } from '@/app/utils/actions'
import { useFormState } from 'react-dom'
import { useAsync } from '@/app/hooks/use_async'
import { useSignAndSendTransaction } from '@/app/hooks/use_sign_and_send_transaction'
import { useSerializedTransaction } from '@/app/hooks/use_serialized_transaction'
import { usePayer } from '@/app/hooks/use_payer'
import { ErrorMessage } from '@/app/comps/error_message'

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

	const transaction = useSerializedTransaction({ serializedTransaction })

	const signAndSendTransaction = useSignAndSendTransaction()

	const { run, isLoading, isError, error } = useAsync()

	useEffect(() => {
		if (transaction) run(signAndSendTransaction(transaction))
	}, [run, signAndSendTransaction, transaction])

	return (
		<>
			<div className="z-10 m-auto flex w-full flex-col divide-zinc-600 overflow-hidden rounded-xl bg-gray-900 shadow-lg shadow-black/40 sm:max-w-xl">
				<PreviewImage
					src={previewImage}
					clearPreviewImage={clearPreviewImage}
					errors={fields.image.errors}
				/>

				<form
					className="relative z-10 h-full w-full min-w-0 bg-gray-900"
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

						<div className="flex items-end w-full gap-2 p-3 h-[69px]">
							<div className="flex flex-1 gap-1 sm:gap-2">
								<ImageChooser
									name={fields.image.name}
									setPreviewImage={setPreviewImage}
									fileRef={fileRef}
								/>

								<MintToggle />
								<FreezeToggle />
							</div>

							<SubmitButton isLoading={isLoading} />
						</div>
					</div>
				</form>
			</div>
			{isError ? <ErrorMessage error={error} /> : null}
		</>
	)
}

function MintToggle() {
	return (
		<Toggle>
			<Toggle.On>
				<Icon
					name="revoke"
					className="w-4 h-4 shrink-0 translate-x-[2px] translate-y-[0px]"
				/>
				<div className="hidden sm:block">Mint Authority</div>
			</Toggle.On>

			<Toggle.Off>
				<Icon name="control" className="w-4 h-4 shrink-0" />
				<div className="hidden sm:block">Mint Authority</div>
			</Toggle.Off>

			<Toggle.Input inputProps={{ name: 'revokeMint' }} />
		</Toggle>
	)
}

function FreezeToggle() {
	return (
		<Toggle>
			<Toggle.On>
				<Icon
					name="revoke"
					className="w-4 h-4 shrink-0 translate-x-[2px] translate-y-[0px]"
				/>
				<div className="hidden sm:block">Freeze Authority</div>
			</Toggle.On>

			<Toggle.Off>
				<Icon name="control" className="w-4 h-4 shrink-0" />
				<div className="hidden sm:block">Freeze Authority</div>
			</Toggle.Off>

			<Toggle.Input inputProps={{ name: 'revokeFreeze' }} />
		</Toggle>
	)
}
