import { getToken } from '@/app/data/get_token'
import { TokenMetadata } from '@prisma/client'
import { use } from 'react'
import Image from 'next/image'

import { BuyForm } from '@/app/comps/buy_form'

export default function Page({ params }: { params: { id: string } }) {
	const promise = getToken(params.id)
	const res = use(promise)
	const mint = res.data.id

	return (
		<main className="flex-1">
			<div className="mx-auto flex max-w-7xl flex-col px-6 pb-20">
				<section className="grid gap-4">
					<div className="relative z-10 m-auto flex w-full flex-col gap-2 sm:max-w-xl">
						<BuyForm mint={mint} />
					</div>
				</section>
			</div>
		</main>
	)
}

function Avatar({ data }: { data: TokenMetadata }) {
	return (
		<div className="flex flex-1 items-center gap-2 overflow-hidden">
			<div className="relative flex-none size-8 shrink-0 rounded-full overflow-hidden">
				<Image
					src={data.image}
					alt={data.description}
					className="relative aspect-[48/44] object-cover object-center rounded-lg"
					fill={true}
				/>
			</div>

			<button
				className="relative max-w-full overflow-hidden"
				title={data.description}
			>
				<div className="relative flex-1 overflow-hidden text-ellipsis rounded-2xl bg-[#ebebeb] px-3 py-1">
					<span className="text-left text-sm line-clamp-1 break-all">
						{data.name}
					</span>
				</div>
			</button>
		</div>
	)
}
