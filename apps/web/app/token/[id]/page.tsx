import { getToken } from '@/app/data/get_token'
import { ReactNode, use } from 'react'
import { SwapForm } from '@/app/comps/swap_form'

import { Pill } from '@/app/comps/pill'
import { TokenLogo } from '@/app/comps/token_logo'
import { Progress } from '@/app/comps/progress'
import { fetchBondingCurveState } from '@repo/degenerator'
import { getBondingCurveState } from '@/app/data/get_bonding_curve_state'

export const revalidate = 10
export const dynamic = 'force-dynamic'

interface CurveState
	extends Awaited<ReturnType<typeof fetchBondingCurveState>> {}

export default function Page({ params }: { params: { id: string } }) {
	const tokenPromise = getToken(params.id)
	const res = use(tokenPromise)
	const mint = res.data.id

	const curvePromise = getBondingCurveState(mint)
	const curve = use(curvePromise)

	function TokenPill() {
		return (
			<Pill variant="swap">
				<TokenLogo src={res.data.image} alt={res.data.name} />
				<div className="w-fit">{res.data.symbol}</div>
			</Pill>
		)
	}

	function getSwapFormProps({
		curve,
		pill,
	}: {
		curve: CurveState
		pill: ReactNode
	}) {
		return {
			curve: {
				...curve,
				currentSupply: curve.currentSupply.toString(),
				reserveBalance: curve.reserveBalance.toString(),
				mint: curve.mint.toBase58(),
			},
			pill,
		}
	}

	return (
		<div className="w-full sm:max-w-xl flex flex-col gap-6">
			<SwapForm {...getSwapFormProps({ curve, pill: <TokenPill /> })} />
			<Progress progress={curve.progress} />
		</div>
	)
}
