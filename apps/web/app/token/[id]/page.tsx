import { getToken } from '@/app/data/get_token'
import { use } from 'react'
import { SwapForm } from '@/app/comps/swap_form'

import { Pill } from '@/app/comps/pill'
import { TokenLogo } from '@/app/comps/token_logo'
import { Progress } from '@/app/comps/progress'
import { getPoolState } from '@/app/data/get_pool_state'

export const revalidate = 10
export const dynamic = 'force-dynamic'

export default function Page({ params }: { params: { id: string } }) {
	const tokenPromise = getToken(params.id)
	const res = use(tokenPromise)
	const mint = res.data.id

	const poolPromise = getPoolState(mint)
	const pool = use(poolPromise)

	const { reserveBalance, reserveWeight } = pool

	return (
		<div className="w-full sm:max-w-xl flex flex-col gap-6">
			<SwapForm
				mint={mint}
				token={
					<Pill variant="swap">
						<TokenLogo src={res.data.image} alt={res.data.name} />
						<div className="w-fit">{res.data.symbol}</div>
					</Pill>
				}
			/>
		</div>
	)
}
