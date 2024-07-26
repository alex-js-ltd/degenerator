import * as React from 'react'
import { TokenForm } from '@/app/comps/token_form'
import { type Raydium } from '@raydium-io/raydium-sdk-v2'
import { type SelectItemConfig } from '@/app/comps/select'
import { MintB } from '@/app/comps/select'
import { initSdk } from '@/app/utils/raydium'
import { Pool } from '@/app/comps/pool'

export default async function Page() {
	return (
		<TokenForm>
			<React.Suspense fallback={<Loading />}>
				<MintList />
			</React.Suspense>
		</TokenForm>
	)
}

async function getMintBProps(raydium: Raydium) {
	const data = await raydium.api.getTokenInfo([
		'So11111111111111111111111111111111111111112',
		'4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
	])

	const mintItems = data.reduce<SelectItemConfig[]>((acc, curr) => {
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

	const mintBprops = await getMintBProps(raydium)

	return (
		<React.Fragment>
			<MintB {...mintBprops} />
			<Pool items={mintBprops.items} />
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
