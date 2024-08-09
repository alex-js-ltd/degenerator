import { type ApiV3TokenRes, initSdk } from '@/app/utils/raydium'
import { type SelectItemConfig } from '@/app/comps/select'
import { cache } from 'react'
import 'server-only'

function parseMintList(data: ApiV3TokenRes) {
	return data.mintList.reduce<SelectItemConfig[]>((acc, curr) => {
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
}

async function fetchMintList() {
	const raydium = await initSdk({})
	const data = await raydium.api.getTokenList()
	return { items: parseMintList(data) }
}

export const getMintList = cache(async () => {
	const mintList = await fetchMintList()
	return mintList
})
