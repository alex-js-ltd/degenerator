import { getToken } from '@/app/data/get_token'
import { TokenMetadata } from '@prisma/client'
import { use } from 'react'
import Image from 'next/image'

import { Field } from '@/app/comps/field'
import { Input } from '@/app/comps/input'
import { SubmitButton } from '@/app/comps/submit_button'

export default function Page({ params }: { params: { id: string } }) {
	const promise = getToken(params.id)
	const data = use(promise)

	return (
		<main className="flex-1">
			<div className="mx-auto flex max-w-7xl flex-col px-6 pb-20">
				<section className="grid gap-4">
					<div className="relative z-10 m-auto flex w-full flex-col gap-2 sm:max-w-xl">
						<BuyForm />
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

function BuyForm() {
	return (
		<div className="rounded-b-xl">
			<form className="has-[:focus-visible]:border-alpha-600 relative rounded-xl border bg-white shadow transition-colors duration-300 ease-in">
				<div className="relative z-10 grid rounded-xl bg-white">
					<label className="sr-only" htmlFor="chat-main-textarea">
						Buy input
					</label>
					<textarea
						autoFocus
						id="chat-main-textarea"
						name="content"
						placeholder="Amount..."
						rows={1}
						className="resize-none overflow-auto w-full flex-1 bg-transparent p-3 pb-1.5 text-sm outline-none ring-0"
						data-1p-ignore="true"
						data-dashlane-disabled-on-field="true"
						style={{ minHeight: '42px', maxHeight: '384px', height: '42px' }}
					/>
					<div className="flex items-center gap-2 p-3">
						<button
							className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 has-[:focus-visible]:ring-2 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 disabled:border-alpha-400 border-alpha-600 bg-gray-900 text-white hover:border-gray-700 hover:bg-gray-700 focus:border-gray-700 focus:bg-gray-700 focus-visible:border-gray-700 focus-visible:bg-gray-700 h-8 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] rounded-lg ml-auto"
							disabled
							type="submit"
						>
							<svg
								height={16}
								strokeLinejoin="round"
								viewBox="0 0 16 16"
								width="16"
								style={{ color: 'currentColor' }}
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M8.70711 1.39644C8.31659 1.00592 7.68342 1.00592 7.2929 1.39644L2.21968 6.46966L1.68935 6.99999L2.75001 8.06065L3.28034 7.53032L7.25001 3.56065V14.25V15H8.75001V14.25V3.56065L12.7197 7.53032L13.25 8.06065L14.3107 6.99999L13.7803 6.46966L8.70711 1.39644Z"
									fill="currentColor"
								></path>
							</svg>
							Buy
						</button>
					</div>
				</div>
			</form>
		</div>
	)
}
