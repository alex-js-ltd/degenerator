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
import { useAsync } from '@/app/hooks/use_async'
import { usePayer } from '@/app/hooks/use_payer'
import { Toast, getSuccessProps, getErrorProps } from '@/app/comps/toast'
import { type SelectItemConfig, QuoteToken, FeeTier } from '@/app/comps/select'
import { SubmitButton } from '@/app/comps/submit_button'
import { useRaydium } from '@/app/hooks/use_raydium'
import { useClmm } from '@/app/hooks/use_clmm'

export function ClmmForm({
	mintItems,
	clmmItems,
	mint1,
}: {
	mintItems: SelectItemConfig[]
	clmmItems: SelectItemConfig[]
	mint1?: string
}) {
	const [form, fields] = useForm({
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ClmmSchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	const payer = usePayer()
	const initSdk = useRaydium()
	const createPool = useClmm()
	console.log(mint1)
	const {
		run,
		data: txSig,
		isLoading,
		isSuccess,
		isError,
		error,
		reset,
	} = useAsync<string>()

	return (
		<Fragment>
			<FormProvider context={form.context}>
				<form
					{...getFormProps(form)}
					action={async (formData: FormData) => {
						const submission = parseWithZod(formData, {
							schema: ClmmSchema,
						})

						console.log(submission)

						if (submission.status !== 'success') {
							return {
								...submission.reply(),
							}
						}

						const { owner, mint1, mint2, feeTier } = submission.value

						const raydium = await initSdk({ owner })

						const res = await createPool({
							raydium,
							mint1,
							mint2,
							feeTier,
						})
						console.log(res)
					}}
					className="flex w-full"
				>
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
						form={form.id}
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
