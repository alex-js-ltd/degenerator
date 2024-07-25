import * as React from 'react'
import { type Raydium, initSdk } from '@/app/utils/raydium'
import { TokenForm } from '@/app/comps/token_form'
import { type SelectItemConfig } from '@/app/comps/select'
import { QuoteToken } from '@/app/comps/select'

export default async function Page() {
	return <TokenForm />
}

async function getQuoteTokenProps(raydium: Raydium) {
	const data = await raydium.api.getTokenInfo([
		'So11111111111111111111111111111111111111112',
		'4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
		'2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo',
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

	const quoteProps = await getQuoteTokenProps(raydium)

	return (
		<React.Fragment>
			<QuoteToken {...quoteProps} />
		</React.Fragment>
	)
}

function Loading() {
	return (
		<React.Fragment>
			<div className="flex-1 h-[32px] rounded bg-slate-800 animate-pulse" />
		</React.Fragment>
	)
}
