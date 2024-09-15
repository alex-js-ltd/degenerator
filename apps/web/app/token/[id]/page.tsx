import { getToken } from '@/app/data/get_token'
import { use } from 'react'
import { SwapForm } from '@/app/comps/swap_form'

import { Pill } from '@/app/comps/pill'
import { TokenLogo } from '@/app/comps/token_logo'
import { Progress } from '@/app/comps/progress'
import { getPoolState } from '@/app/data/get_pool_state'
import { type PoolState } from '@repo/degenerator'
import { BN } from '@coral-xyz/anchor'

export default function Page({ params }: { params: { id: string } }) {
	const tokenPromise = getToken(params.id)
	const res = use(tokenPromise)
	const mint = res.data.id

	const poolPromise = getPoolState(mint)
	const poolState = use(poolPromise)

	const { currentSupply, totalSupply } = poolState

	const progress = getProgressProps({ currentSupply, totalSupply })

	console.log('progress', progress.toString())

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

			<Progress progress={progress.toNumber()} />
		</div>
	)
}

function getProgressProps({
	currentSupply,
	totalSupply,
}: Pick<PoolState, 'currentSupply' | 'totalSupply'>): BN {
	// Handle edge case where totalSupply is zero
	if (totalSupply.isZero()) {
		return new BN(100) // Progress is 100% if no total supply
	}

	// Handle edge case where currentSupply is zero
	if (currentSupply.isZero()) {
		return new BN(100) // Progress is 100% if current supply is zero
	}

	// Handle edge case where currentSupply equals totalSupply
	if (currentSupply.eq(totalSupply)) {
		return new BN(0) // Progress is 0% if current supply is equal to total supply
	}

	// Calculate progress as inverse percentage
	const progress = totalSupply
		.sub(currentSupply)
		.mul(new BN(100))
		.div(totalSupply)

	return progress
}
