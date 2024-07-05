import invariant from 'tiny-invariant'
import { Form } from './comps/form'
import type { ApiV3TokenRes } from '@raydium-io/raydium-sdk-v2'

async function getApiV3TokenList(): Promise<ApiV3TokenRes> {
	const res = await fetch('https://api-v3.raydium.io/mint/list')

	invariant(res.ok, 'Failed to fetch data')

	const data = await res.json()

	return data.data
}

export default async function Page() {
	const data = await getApiV3TokenList()
	const mintList = data.mintList.filter(el => Boolean(el.name))

	return <Form mintList={mintList} />
}
