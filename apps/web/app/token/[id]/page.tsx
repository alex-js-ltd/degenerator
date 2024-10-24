import { getToken } from '@/app/data/get_token'
import { ReactNode, use } from 'react'
import { type SwapFormProps, SwapForm } from '@/app/comps/swap_form'
import { Pill } from '@/app/comps/pill'
import { TokenLogo } from '@/app/comps/token_logo'
import { Progress } from '@/app/comps/progress'
import { fetchBondingCurveState } from '@repo/degenerator'
import { getBondingCurveState } from '@/app/data/get_bonding_curve_state'
import { getEvents } from '@/app/data/get_events'
import { ChartComponent } from '@/app/comps/chart'
import { UTCTimestamp } from 'lightweight-charts'

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

	const eventsPromise = getEvents(mint)
	const events = use(eventsPromise)

	const chartData = events
		.map(el => ({
			time: el.data.blockTimestamp.toNumber() as UTCTimestamp,
			value: el.data.price / el.data.amount,
		}))
		.toSorted((a, b) => a.time - b.time)

	console.log(chartData)

	console.log(chartData)
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
	}): SwapFormProps {
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
			<Progress progress={curve.progress} mint={curve.mint.toBase58()} />
			<ChartComponent data={chartData} />
			<SwapForm {...getSwapFormProps({ curve, pill: <TokenPill /> })} />
		</div>
	)
}
