import { getToken } from '@/app/data/get_token'
import { use } from 'react'
import { BuyForm } from '@/app/comps/buy_form'

import { Pill } from '@/app/comps/pill'
import { TokenLogo } from '@/app/comps/token_logo'

export default function Page({ params }: { params: { id: string } }) {
	const promise = getToken(params.id)
	const res = use(promise)
	const mint = res.data.id

	return (
		<main className="flex-1">
			<div className="mx-auto flex max-w-7xl flex-col px-6 pb-20">
				<section className="grid gap-4">
					<div className="relative z-10 m-auto flex w-full flex-col gap-2 sm:max-w-xl">
						<BuyForm
							mint={mint}
							token={
								<Pill variant="swap">
									<TokenLogo src={res.data.image} alt={res.data.name} />
									<div className="w-fit">{res.data.symbol}</div>
								</Pill>
							}
						/>
					</div>
				</section>
			</div>
		</main>
	)
}
