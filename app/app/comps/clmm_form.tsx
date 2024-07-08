'use client'

import { Fragment, useEffect } from 'react'
import {
	useForm,
	getFormProps,
	getInputProps,
	FormProvider,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { ClmmSchema } from '@/app/utils/schemas'
import { Input } from '@/app/comps/input'
import { useFormState } from 'react-dom'
import { useAsync } from '@/app/hooks/use_async'
import { useSignAndSendTransaction } from '@/app/hooks/use_sign_and_send_transaction'
import { useSerializedTransaction } from '@/app/hooks/use_serialized_transaction'
import { usePayer } from '@/app/hooks/use_payer'
import { Toast, getSuccessProps, getErrorProps } from '@/app/comps/toast'
import { type SelectItemConfig, QuoteToken, FeeTier } from '@/app/comps/select'
import { clmm } from '@/app/actions/clmm'
import { SubmitButton } from '@/app/comps/submit_button'

const initialState = {
	serializedTransaction: undefined,
}

export function ClmmForm({
	mintItems,
	clmmItems,
	mint1,
}: {
	mintItems: SelectItemConfig[]
	clmmItems: SelectItemConfig[]
	mint1?: string
}) {
	const [lastResult, action] = useFormState(clmm, initialState)

	const [form, fields] = useForm({
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ClmmSchema })
		},
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
		reset,
	} = useAsync<string>()

	useEffect(() => {
		if (transaction) run(signAndSendTransaction(transaction))
	}, [run, signAndSendTransaction, transaction])

	return (
		<Fragment>
			<FormProvider context={form.context}>
				<form {...getFormProps(form)} action={action} className="flex w-full">
					<Input
						{...getInputProps(fields.owner, { type: 'hidden' })}
						defaultValue={payer}
					/>

					<Input
						{...getInputProps(fields.mint1, { type: 'hidden' })}
						defaultValue={mint1}
					/>

					<QuoteToken name={fields.mint2.name} items={mintItems} />

					<FeeTier name={fields.feeTier.name} items={clmmItems} />

					<button
						type="submit"
						className="w-8 h-8 border border-teal-300 ml-3 rounded"
					></button>
				</form>
			</FormProvider>
			{payer && error ? <Toast {...getErrorProps({ isError, error })} /> : null}
			{txSig ? <Toast {...getSuccessProps({ isSuccess, txSig })} /> : null}
		</Fragment>
	)
}
