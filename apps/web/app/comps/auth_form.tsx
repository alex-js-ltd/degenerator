'use client'

import { signIn, signOut } from '@/app/actions/authenticate'
import { usePayer } from '@/app/hooks/use_payer'
import { useServerAction } from '@/app/hooks/use_server_action'

export function AuthForm() {
	const payer = usePayer()
	const connected = typeof payer === 'string'
	const disconnected = typeof payer === 'undefined'

	const getSignInButton = useServerAction(signIn, connected)
	const getSignOutButton = useServerAction(signOut, disconnected)

	return (
		<form className="sr-only">
			<input name="publicKey" defaultValue={payer} type="hidden" />

			<button {...getSignInButton()} />

			<button {...getSignOutButton()} />
		</form>
	)
}
