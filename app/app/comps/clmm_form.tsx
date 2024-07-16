'use client'

import { type ReactNode } from 'react'
import { useForm, getFormProps, getInputProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { ClmmSchema } from '@/app/utils/schemas'
import { clmm } from '@/app/actions/clmm'
import { useFormState } from 'react-dom'
import { usePayer } from '@/app/hooks/use_payer'
import { Input } from '@/app/comps/input'
import { useTransaction } from '@/app/hooks/use_transaction'

const initialState = {
	serializedTransaction: undefined,
}

export function ClmmForm({
	children = null,
	mint1,
}: {
	children?: ReactNode
	mint1?: string | undefined
}) {
	const [lastResult, action] = useFormState(clmm, initialState)

	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ClmmSchema })
		},

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',

		shouldRevalidate: 'onInput',

		lastResult,
	})

	const { serializedTransaction } = lastResult

	const payer = usePayer()

	const {
		data: txSig,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useTransaction(serializedTransaction)

	return (
		<form action={action} {...getFormProps(form)}>
			<Input
				{...getInputProps(fields.payerKey, {
					type: 'hidden',
				})}
				defaultValue={payer}
			/>

			<Input
				{...getInputProps(fields.mint1, {
					type: 'hidden',
				})}
				defaultValue={mint1}
			/>
			{children}
		</form>
	)
}
