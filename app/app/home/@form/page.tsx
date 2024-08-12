import { Suspense, Fragment } from 'react'
import { Background } from '@/app/comps/background'
import { TokenForm } from '@/app/comps/token_form'
import { MintList } from '@/app/comps/select'
import { PoolAmounts } from '@/app/comps/pool_amounts'
import { PoolProvider } from '@/app/context/pool_context'
import { getMintList } from '@/app/data/mint_list'

export default async function Page() {
	return (
		<Background>
			<TokenForm>
				<Suspense fallback={<Loading />}>
					<Pool />
				</Suspense>
			</TokenForm>
		</Background>
	)
}

async function Pool() {
	const data = await getMintList()

	return (
		<PoolProvider {...data}>
			<MintList />
			<PoolAmounts />
		</PoolProvider>
	)
}

function Loading() {
	return (
		<Fragment>
			<div className="w-28 h-[32px] rounded bg-slate-800 animate-pulse" />
			<div className="w-28 h-[32px] rounded bg-slate-800 animate-pulse" />
		</Fragment>
	)
}
