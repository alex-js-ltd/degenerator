import { getToken } from '@/app/data/get_token'
import { use } from 'react'
import { SwapForm } from '@/app/comps/swap_form'

import { Pill } from '@/app/comps/pill'
import { TokenLogo } from '@/app/comps/token_logo'

export default function Page({ params }: { params: { id: string } }) {
	const promise = getToken(params.id)
	const res = use(promise)
	const mint = res.data.id

	return (
		<>
			<SwapForm
				mint={mint}
				token={
					<Pill variant="swap">
						<TokenLogo src={res.data.image} alt={res.data.name} />
						<div className="w-fit">{res.data.symbol}</div>
					</Pill>
				}
			/>
		</>
	)
}
