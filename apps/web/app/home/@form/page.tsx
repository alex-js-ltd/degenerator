import { Background } from '@/app/comps/background'
import { TokenForm } from '@/app/comps/token_form'

import { auth } from '@/auth'

export default async function Page() {
	const res = await auth()

	console.log('res', res)
	return (
		<Background>
			<TokenForm />
		</Background>
	)
}
