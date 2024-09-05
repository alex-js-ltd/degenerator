'use client'

import { useActionState } from 'react'

import {
	useForm,
	getFormProps,
	getInputProps,
	FormProvider,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { AuthSchema } from '@/app/utils/schemas'
import { authenticate } from '@/app/actions/authenticate'
import { usePayer } from '@/app/hooks/use_payer'
import { useServerAction } from '@/app/hooks/use_server_action'

const initialState = ''

export function AuthForm() {
	const [lastResult, formAction, isPending] = useActionState(
		authenticate,
		initialState,
	)

	const payer = usePayer()

	const getButtonProps = useServerAction(formAction, payer)

	return (
		<form>
			<input name="publicKey" defaultValue={payer} type="hidden" />

			<button {...getButtonProps()} />
		</form>
	)
}
