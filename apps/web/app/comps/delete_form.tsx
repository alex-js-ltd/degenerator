'use client'

import { useActionState } from 'react'
import { deleteToken } from '@/app/actions/delete_token'
import { useServerAction } from '@/app/hooks/use_server_action'
import { usePayer } from '@/app/hooks/use_payer'

const initialState = ''

export function DeleteForm({ mint }: { mint: string }) {
	const [lastResult, formAction] = useActionState(deleteToken, initialState)

	const getButtonProps = useServerAction(formAction, mint)

	const payer = usePayer()

	return (
		<form className="sr-only">
			<input name="mint" defaultValue={mint} type="hidden" />
			<input name="ownerId" defaultValue={payer} type="hidden" />
			<button {...getButtonProps()} />
		</form>
	)
}
