'use client'

import { Fragment } from 'react'
import { useForm, getFormProps, getInputProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { ClmmSchema } from '@/app/utils/schemas'
import { Input } from '@/app/comps/input'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { useAsync } from '@/app/hooks/use_async'
import { useSignAndSendTransaction } from '@/app/hooks/use_sign_and_send_transaction'
import { useSerializedTransaction } from '@/app/hooks/use_serialized_transaction'
import { usePayer } from '@/app/hooks/use_payer'
import { Toast, getSuccessProps, getErrorProps } from '@/app/comps/toast'
import { clmm } from '@/app/actions/clmm'

const initialState = {
	serializedTransaction: undefined,
}

export function Clmm({ mint1 }: { mint1: string }) {
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
			<form {...getFormProps(form)} action={action}>
				<Input
					{...getInputProps(fields.owner, {
						type: 'hidden',
					})}
					defaultValue={payer}
				/>

				<Input
					{...getInputProps(fields.mint1, {
						type: 'text',
					})}
					defaultValue={mint1}
				/>

				<button type="submit">create pool</button>
			</form>

			{payer && error ? <Toast {...getErrorProps({ isError, error })} /> : null}
			{txSig ? <Toast {...getSuccessProps({ isSuccess, txSig })} /> : null}
		</Fragment>
	)
}
