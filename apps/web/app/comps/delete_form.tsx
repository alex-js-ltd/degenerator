'use client'

import { useActionState } from 'react'
import { deleteToken } from '@/app/actions/delete_token'
import { useServerAction } from '@/app/hooks/use_server_action'

const initialState = ''

export function DeleteForm({ mint }: { mint: string }) {
	const [lastResult, formAction] = useActionState(deleteToken, initialState)

	const getButtonProps = useServerAction(formAction, mint)

	return (
		<form className="sr-only">
			<input name="mint" defaultValue={mint} type="hidden" />
			<button {...getButtonProps()} />
		</form>
	)
}
