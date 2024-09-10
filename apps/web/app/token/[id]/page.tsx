import { getToken } from '@/app/data/get_token'
import { use } from 'react'
import { BuyForm } from '@/app/comps/buy_form'
import { Button } from '@/app/comps/button'
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
								<Button
									className="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:pointer-events-none disabled:cursor-not-allowed bg-gray-100 text-gray-400 ring-0 has-[:focus-visible]:ring-2 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 border-gray-200   hover:bg-gray-100  h-8 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] rounded-lg max-w-fit"
									asChild
								>
									<div className="flex w-full items-center justify-between">
										<TokenLogo src={res.data.image} alt={res.data.name} />
										<div className="w-fit">{res.data.symbol}</div>
									</div>
								</Button>
							}
						/>
					</div>
				</section>
			</div>
		</main>
	)
}
