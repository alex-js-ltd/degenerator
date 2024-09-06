import { Background } from '@/app/comps/background'
import { TokenForm } from '@/app/comps/token_form'
import { auth } from '@/auth'

export default async function Page() {
	const session = await auth()

	console.log(session)
	return (
		<Background>
			<TokenForm />
		</Background>
	)
}
