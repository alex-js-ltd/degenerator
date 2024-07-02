'use client'

import { Fragment } from 'react'
import { useForm, getFormProps, getInputProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { TokenSchema, PoolSchema } from '@/app/utils/schemas'
import { useImageUpload } from '@/app/hooks/use_image_upload'
import { ImageChooser } from '@/app/comps/image_chooser'
import { PreviewImage } from '@/app/comps/preview_image'
import { Field } from '@/app/comps/field'
import { Input } from '@/app/comps/input'
import { MintToggle, FreezeToggle } from '@/app/comps/toggle'
import { useEffect } from 'react'
import { SubmitButton } from '@/app/comps/submit_button'
import { createSplToken } from '@/app/actions/create_spl_token'
import { useFormState } from 'react-dom'
import { useAsync } from '@/app/hooks/use_async'
import { useSignAndSendTransaction } from '@/app/hooks/use_sign_and_send_transaction'
import { useSerializedTransaction } from '@/app/hooks/use_serialized_transaction'
import { usePayer } from '@/app/hooks/use_payer'
import { Toast, getSuccessProps, getErrorProps } from '@/app/comps/toast'
import { dlmm } from '@/app/actions/dlmm'

const initialState = {
	serializedTransaction: undefined,
	tokenX: undefined,
}

export default function Page() {
	const [lastResult, action] = useFormState(createSplToken, initialState)

	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: TokenSchema })
		},

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',

		shouldRevalidate: 'onInput',

		lastResult,
	})

	const { previewImage, clearPreviewImage, fileRef, onChange } =
		useImageUpload()

	const payer = usePayer()

	const { serializedTransaction, tokenX } = lastResult

	const transaction = useSerializedTransaction({ serializedTransaction })

	const signAndSendTransaction = useSignAndSendTransaction()

	const {
		run,
		data: txSig,
		isLoading,
		isSuccess,
		isError,
		error,
		reset,
	} = useAsync<string>()

	useEffect(() => {
		if (transaction) run(signAndSendTransaction(transaction)).then(reset)
	}, [run, signAndSendTransaction, transaction])

	return (
		<Fragment>
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
								{...getInputProps(fields.payerKey, {
									type: 'hidden',
								})}
								defaultValue={payer}
							/>
						</div>

						<div className="flex items-end w-full gap-2 p-3 h-[69px]">
							<div className="flex flex-1 gap-1 sm:gap-2">
								<ImageChooser
									name={fields.image.name}
									fileRef={fileRef}
									onChange={onChange}
								/>

								<MintToggle />
								<FreezeToggle />
							</div>

							<SubmitButton isLoading={isLoading} />
						</div>
					</div>
				</form>
			</div>
			{payer && error ? <Toast {...getErrorProps({ isError, error })} /> : null}
			{txSig ? <Toast {...getSuccessProps({ isSuccess, txSig })} /> : null}

			{tokenX ? <CreatePool tokenX={tokenX} /> : null}
		</Fragment>
	)
}

function CreatePool({ tokenX }: { tokenX: string }) {
	const [lastResult, action] = useFormState(dlmm, initialState)

	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: PoolSchema })
		},

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',

		shouldRevalidate: 'onInput',
	})

	const payer = usePayer()

	const { serializedTransaction } = lastResult

	const transaction = useSerializedTransaction({ serializedTransaction })

	const signAndSendTransaction = useSignAndSendTransaction()

	const {
		run,
		data: txSig,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useAsync<string>()

	useEffect(() => {
		if (transaction) run(signAndSendTransaction(transaction))
	}, [run, signAndSendTransaction, transaction])

	return (
		<form {...getFormProps(form)} action={action}>
			<Input
				{...getInputProps(fields.user, {
					type: 'hidden',
				})}
				defaultValue={payer}
			/>

			<Input
				{...getInputProps(fields.tokenX, {
					type: 'text',
				})}
				defaultValue={tokenX}
			/>

			<button type="submit">create pool</button>
		</form>
	)
}
