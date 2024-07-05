import invariant from 'tiny-invariant'
import { Form } from '@/app/comps/form'
import type { ApiV3TokenRes } from '@raydium-io/raydium-sdk-v2'
import type { SelectFieldProps } from '@/app/comps/select'

async function getApiV3TokenList(): Promise<ApiV3TokenRes> {
	const res = await fetch('https://api-v3.raydium.io/mint/list')

	invariant(res.ok, 'Failed to fetch data')

	const data = await res.json()

	return data.data
}

export default async function Page() {
	const data = await getApiV3TokenList()

	const initial: SelectFieldProps['options'] = []

	const mintOptions = data.mintList.reduce((acc, curr) => {
		const { address, name, logoURI, symbol } = curr

		const option = {
			value: address,
			name,
			children: name,
			imageProps: { src: logoURI, alt: symbol },
		}

		if (name) acc.push(option)

		return acc
	}, initial)

	return <Form mintOptions={mintOptions} />
}
