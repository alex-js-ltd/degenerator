import { Background } from '@/app/comps/background'
import { MintForm } from '@/app/comps/mint_form'

import { auth } from '@/auth'

export default async function Page() {
	const res = await auth()

	console.log('res', res)
	return (
		<Background>
			<MintForm />
		</Background>
	)
}
