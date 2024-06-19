'use client'

import { useForm, getFormProps, getInputProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { CLMMSchema } from '@/app/utils/schemas'
import { Input } from '@/app/comps/input'

import { useClmm } from '@/app/hooks/use_clmm'
import { useAsync } from '@/app/hooks/use_async'
import { useSignAndSendTransaction } from '@/app/hooks/use_sign_and_send_transaction'
import { usePayer } from '@/app/hooks/use_payer'

export function CLMM() {
	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: CLMMSchema })
		},

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',

		shouldRevalidate: 'onInput',
	})

	const payer = usePayer()

	const { initSdk } = useClmm()

	const { run, data, isLoading, isSuccess, isError, error, reset } = useAsync()

	console.log(data)
	return (
		<form
			{...getFormProps(form)}
			action={async (formData: FormData) => {
				const submission = parseWithZod(formData, {
					schema: CLMMSchema,
				})

				if (submission.status !== 'success') return

				const { owner } = submission.value

				run(initSdk({ owner }))
			}}
		>
			<Input
				{...getInputProps(fields.owner, {
					type: 'hidden',
				})}
				defaultValue={payer}
			/>

			<button type="submit">create pool</button>
		</form>
	)
}
