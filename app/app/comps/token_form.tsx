'use client'

import { type ReactNode, Fragment, useRef, useMemo, useEffect } from 'react'
import {
	useForm,
	getFormProps,
	getInputProps,
	FormProvider,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { Schema } from '@/app/utils/schemas'
import { useImageUpload } from '@/app/hooks/use_image_upload'
import { ImageChooser } from '@/app/comps/image_chooser'
import { PreviewImage } from '@/app/comps/preview_image'
import { Field } from '@/app/comps/field'
import { Input } from '@/app/comps/input'
import { SubmitButton } from '@/app/comps/submit_button'
import { mintToken } from '@/app/actions/mint_token'
import { clmm } from '@/app/actions/clmm'
import { useFormState } from 'react-dom'
import { usePayer } from '@/app/hooks/use_payer'
import { Toast, getSuccessProps, getErrorProps } from '@/app/comps/toast'
import { ClmmCheckbox } from '@/app/comps/checkbox'
import { useTransaction } from '@/app/hooks/use_transaction'
import { ResetButton } from './reset_button'

const mintState = {
	serializedTransaction: undefined,
	mint1: undefined,
}

const clmmState = {
	serializedTransaction: undefined,
}

export function TokenForm({ children = null }: { children: ReactNode }) {
	const [mintResult, mintAction] = useFormState(mintToken, mintState)
	const [clmmResult, clmmAction] = useFormState(clmm, clmmState)

	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: Schema })
		},

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',

		shouldRevalidate: 'onInput',

		lastResult: mintResult,

		defaultValue: {
			clmm: 'on',
		},
	})

	const { mint1 } = mintResult

	const {
		data: txSig,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useTransaction(mintResult?.serializedTransaction)

	useTransaction(clmmResult?.serializedTransaction)

	const { previewImage, clearPreviewImage, fileRef, onChange } =
		useImageUpload()

	const payer = usePayer()
	const buttonRef = useRef<HTMLButtonElement>(null)

	const showClmm = fields.clmm.value === 'on'
	const initClmm = useMemo(
		() => (txSig && showClmm && mint1 ? true : false),
		[txSig, showClmm, mint1],
	)

	useEffect(() => {
		if (initClmm && buttonRef.current) {
			buttonRef.current.click()
		}
	}, [initClmm])

	return (
		<Fragment>
			<div className="relative z-10 m-auto flex w-full flex-col divide-zinc-600 overflow-hidden rounded-xl bg-gray-900 shadow-lg shadow-black/40 sm:max-w-xl">
				<FormProvider context={form.context}>
					<PreviewImage
						src={previewImage}
						clearPreviewImage={clearPreviewImage}
						errors={fields.image.errors}
					/>

					<div className="absolute top-2.5 right-10 p-1 w-5 h-5">
						<ResetButton isLoading={isLoading} onClick={clearPreviewImage} />
					</div>

					<div className="absolute right-3.5 top-2.5 z-10 p-1 w-5 h-5">
						<ClmmCheckbox />
					</div>

					<form
						className="relative z-10 h-full w-full min-w-0 bg-gray-900"
						{...getFormProps(form)}
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
											type: 'text',
										}),
										placeholder: 'Decimals',
									}}
									errors={fields.decimals.errors}
								/>

								<Field
									inputProps={{
										...getInputProps(fields.supply, {
											type: 'text',
										}),
										placeholder: 'Supply',
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

								<input
									{...getInputProps(fields.mint1, {
										type: 'hidden',
									})}
									defaultValue={mint1}
								/>
							</div>

							<div className="flex items-end w-full gap-2 p-3 h-[69px]">
								<div className="flex flex-1 gap-1 sm:gap-2">
									<ImageChooser
										name={fields.image.name}
										fileRef={fileRef}
										onChange={onChange}
									/>

									{showClmm ? children : null}
								</div>

								{initClmm ? (
									<button
										ref={buttonRef}
										formAction={clmmAction}
										className="sr-only"
										type="submit"
									/>
								) : null}

								<SubmitButton
									form={form.id}
									formAction={mintAction}
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
