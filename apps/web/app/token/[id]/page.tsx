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
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

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
			time: dayjs(el.data.blockTimestamp * 1000)
				.utc()
				.format('H:mm'), // Assuming blockTimestamp is in seconds and converting to milliseconds
			value: el.data.amount,
		}))
		.sort((a, b) => a.time - b.time) // Sort by time in ascending order
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
			<SwapForm {...getSwapFormProps({ curve, pill: <TokenPill /> })} />
			<Progress progress={curve.progress} />

			<ul className="w-full h-auto">
				{events.map(({ data }) => (
					<li
						className="text-gray-700 w-fit flex gap-6"
						key={data.blockTimestamp.toString()}
					>
						<div>{data?.amount}</div>
						<div>{data?.price}</div>
					</li>
				))}
			</ul>

			<ChartComponent data={chartData} />
		</div>
	)
}
