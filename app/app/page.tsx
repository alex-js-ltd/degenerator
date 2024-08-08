import * as React from 'react'
import { TokenForm } from '@/app/comps/token_form'
import { type ApiV3TokenRes, initSdk } from '@/app/utils/raydium'
import { type SelectItemConfig } from '@/app/comps/select'
import { MintB } from '@/app/comps/select'
import { Pool } from '@/app/comps/pool'

export const revalidate = 600 // revalidate the data every 10 minutes

export default async function Page() {
	return (
		<TokenForm>
			<React.Suspense fallback={<Loading />}>
				<MintList />
			</React.Suspense>
		</TokenForm>
	)
}

function getMintBProps(data: ApiV3TokenRes) {
	const mintItems = data.mintList.reduce<SelectItemConfig[]>((acc, curr) => {
		const { address, name, logoURI, symbol } = curr

		const option = {
			value: address,
			children: name,
			title: symbol,
			imageProps: { src: logoURI, alt: symbol },
		}

		if (name) acc.push(option)

		return acc
	}, [])

	return { items: mintItems, name: 'mintB' }
}

async function MintList() {
	const raydium = await initSdk({})
	const data = await raydium.api.getTokenList()
	const mintBprops = getMintBProps(data)

	return (
		<React.Fragment>
			<MintB {...mintBprops} />
			<Pool {...mintBprops} />
		</React.Fragment>
	)
}

function Loading() {
	return (
		<React.Fragment>
			<div className="w-28 h-[32px] rounded bg-slate-800 animate-pulse" />
			<div className="w-28 h-[32px] rounded bg-slate-800 animate-pulse" />
		</React.Fragment>
	)
}
