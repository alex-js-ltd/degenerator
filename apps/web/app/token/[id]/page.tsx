import { getToken } from '@/app/data/get_token'
import { use } from 'react'
import { SwapForm } from '@/app/comps/swap_form'

import { Pill } from '@/app/comps/pill'
import { TokenLogo } from '@/app/comps/token_logo'
import { Progress } from '@/app/comps/progress'
import { getBondingCurveState } from '@/app/data/get_bonding_curve_state'

export const revalidate = 10
export const dynamic = 'force-dynamic'

export default function Page({ params }: { params: { id: string } }) {
	const tokenPromise = getToken(params.id)
	const res = use(tokenPromise)
	const mint = res.data.id

	const curvePromise = getBondingCurveState(mint)
	const curve = use(curvePromise)

	function getCurveProps() {
		return {
			curve: {
				...curve,
				currentSupply: curve.currentSupply.toString(),
				reserveBalance: curve.reserveBalance.toString(),
			},
		}
	}

	return (
		<div className="w-full sm:max-w-xl flex flex-col gap-6">
			<SwapForm
				mint={mint}
				{...getCurveProps()}
				token={
					<Pill variant="swap">
						<TokenLogo src={res.data.image} alt={res.data.name} />
						<div className="w-fit">{res.data.symbol}</div>
					</Pill>
				}
			/>
			<Progress progress={curve.progress} />
		</div>
	)
}
