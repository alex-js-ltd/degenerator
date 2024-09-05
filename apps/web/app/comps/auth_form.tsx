'use client'

import { useActionState } from 'react'
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
		<form className="sr-only">
			<input name="publicKey" defaultValue={payer} type="hidden" />

			<button {...getButtonProps()} />
		</form>
	)
}
