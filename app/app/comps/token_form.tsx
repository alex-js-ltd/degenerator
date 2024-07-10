'use client'

import { type ReactNode, Fragment, useRef, useMemo } from 'react'
import {
	useForm,
	getFormProps,
	getInputProps,
	FormProvider,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { TokenSchema } from '@/app/utils/schemas'
import { useImageUpload } from '@/app/hooks/use_image_upload'
import { ImageChooser } from '@/app/comps/image_chooser'
import { PreviewImage } from '@/app/comps/preview_image'
import { Field } from '@/app/comps/field'
import { Input } from '@/app/comps/input'
import { useEffect } from 'react'
import { SubmitButton } from '@/app/comps/submit_button'
import { createSplToken } from '@/app/actions/create_spl_token'
import { clmm } from '@/app/actions/clmm'
import { useFormState } from 'react-dom'
import { useAsync } from '@/app/hooks/use_async'
import { useSignAndSendTransaction } from '@/app/hooks/use_sign_and_send_transaction'
import { useSerializedTransaction } from '@/app/hooks/use_serialized_transaction'
import { usePayer } from '@/app/hooks/use_payer'
import { Toast, getSuccessProps, getErrorProps } from '@/app/comps/toast'
import { ClmmCheckbox } from '@/app/comps/checkbox'

const initialState = {
	serializedTransaction: undefined,
	mint1: undefined,
}

export function TokenForm({ children }: { children: ReactNode }) {
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

	const { serializedTransaction, mint1 } = lastResult

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

	const showClmm = useMemo(() => fields.clmm.value === 'on', [fields])

	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (transaction) run(signAndSendTransaction(transaction))
	}, [run, signAndSendTransaction, transaction])

	useEffect(() => {
		const formEl = formRef.current
		if (!formEl || !mint1 || !txSig || !showClmm) return

		const createPool = async () => {
			const formData = new FormData(formEl)
			formData.append('mint1', mint1)
			const data = await clmm(undefined, formData)
		}

		createPool()
	}, [txSig, mint1, showClmm])

	return (
		<Fragment>
			<div className="relative z-10 m-auto flex w-full flex-col divide-zinc-600 overflow-hidden rounded-xl bg-gray-900 shadow-lg shadow-black/40 sm:max-w-xl">
				<FormProvider context={form.context}>
					<PreviewImage
						src={previewImage}
						clearPreviewImage={clearPreviewImage}
						errors={fields.image.errors}
					/>

					<div className="absolute right-3.5 top-2.5 z-10 p-1 opacity-50 transition-opacity hover:opacity-80 w-5 h-5">
						<ClmmCheckbox />
					</div>

					<form
						className="relative z-10 h-full w-full min-w-0 bg-gray-900"
						{...getFormProps(form)}
						action={action}
						ref={formRef}
						id={form.id}
					>
						<fieldset className="relative flex w-full flex-1 items-center transition-all duration-300 flex-col gap-6">
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

								{showClmm ? (
									<Field
										inputProps={{
											...getInputProps(fields.initialPrice, {
												type: 'text',
											}),
											placeholder: 'Initial Price',
											className: 'sm:col-span-2 w-full',
										}}
										errors={fields.initialPrice.errors}
									/>
								) : null}

								{showClmm ? (
									<Field
										inputProps={{
											...getInputProps(fields.depositAmount, {
												type: 'text',
											}),
											placeholder: 'Deposit Amount',
											className: 'sm:col-span-2 w-full',
										}}
										errors={fields.depositAmount.errors}
									/>
								) : null}
							</div>

							<div className="flex items-end w-full gap-2 p-3 h-[69px]">
								<div className="flex flex-1 gap-1 sm:gap-2">
									<ImageChooser
										name={fields.image.name}
										fileRef={fileRef}
										onChange={onChange}
									/>

									<fieldset className="flex gap-2 w-full">
										{showClmm ? children : null}
										{showClmm ? <Input /> : null}
									</fieldset>
								</div>

								<SubmitButton
									form={form.id}
									isLoading={isLoading}
									content={showClmm ? 'Mint Token + Create Pool' : 'Mint Token'}
								/>
							</div>
						</fieldset>
					</form>
				</FormProvider>
			</div>

			{payer && error ? <Toast {...getErrorProps({ isError, error })} /> : null}
			{txSig ? <Toast {...getSuccessProps({ isSuccess, txSig })} /> : null}
		</Fragment>
	)
}
