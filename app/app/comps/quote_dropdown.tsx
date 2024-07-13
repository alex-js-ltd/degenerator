'use server'

import { type ApiV3TokenRes } from '@raydium-io/raydium-sdk-v2'
import { type SelectItemConfig } from '@/app/comps/select'
import invariant from 'tiny-invariant'
import { QuoteToken } from '@/app/comps/select'

async function getApiV3TokenList(): Promise<ApiV3TokenRes> {
	const res = await fetch('https://api-v3.raydium.io/mint/list')

	invariant(res.ok, 'Failed to fetch data')

	const data = await res.json()

	return data.data
}

export async function getQuoteTokenProps() {
	const data = await getApiV3TokenList()

	const mintItems = data.mintList.reduce<SelectItemConfig[]>((acc, curr) => {
		const { address, name, logoURI, symbol } = curr

		const option = {
			value: address,
			children: symbol,
			symbol,
			imageProps: { src: logoURI, alt: symbol },
		}

		if (name) acc.push(option)

		return acc
	}, [])

	return { items: mintItems, name: 'mint2' }
}

export async function QuoteDropdown() {
	const props = await getQuoteTokenProps()
	return props ? <QuoteToken {...props} /> : null
}
