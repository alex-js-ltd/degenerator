import { Suspense, Fragment } from 'react'
import { TokenForm } from '@/app/comps/token_form'
import { MintList } from '@/app/comps/select'
import { PoolAmounts } from '@/app/comps/pool_amounts'
import { PoolProvider } from '@/app/context/pool_context'
import { getMintList } from './actions/mint_list'

export const revalidate = 600 // revalidate the data every 10 minutes

export default async function Page() {
	return (
		<TokenForm>
			<Suspense fallback={<Loading />}>
				<Pool />
			</Suspense>
		</TokenForm>
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
