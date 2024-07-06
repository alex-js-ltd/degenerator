import type { ApiV3TokenRes } from '@raydium-io/raydium-sdk-v2'
import type { SelectFieldProps } from '@/app/comps/select'
import invariant from 'tiny-invariant'
import { Form } from '@/app/comps/form'
import { Raydium } from '@raydium-io/raydium-sdk-v2'
import { connection } from '@/app/utils/setup'
import { getEnv } from '@/app/utils/env'

const { CLUSTER } = getEnv()
const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

async function getApiV3TokenList(): Promise<ApiV3TokenRes> {
	const res = await fetch('https://api-v3.raydium.io/mint/list')

	invariant(res.ok, 'Failed to fetch data')

	const data = await res.json()

	return data.data
}

async function getClmmConfigs() {
	const raydium = await Raydium.load({
		owner: undefined,
		connection,
		cluster,
		disableFeatureCheck: true,
		blockhashCommitment: 'finalized',
	})

	const clmmConfigs = await raydium.api.getClmmConfigs()

	invariant(clmmConfigs, 'Failed to fetch clmm configs')

	return clmmConfigs
}

export default async function Page() {
	const data = await getApiV3TokenList()

	const mintOptions = data.mintList.reduce<SelectFieldProps['options']>(
		(acc, curr) => {
			const { address, name, logoURI, symbol } = curr

			const option = {
				value: address,
				name,
				children: symbol,
				imageProps: { src: logoURI, alt: symbol },
			}

			if (name) acc.push(option)

			return acc
		},
		[],
	)

	const clmmConfigs = await getClmmConfigs()
	console.log(clmmConfigs)
	const clmmOptions = clmmConfigs.reduce<SelectFieldProps['options']>(
		(acc, curr) => {
			const { id, description } = curr

			const option = {
				value: id,
				name: description,
				children: description,
			}

			acc.push(option)

			return acc
		},
		[],
	)

	return <Form mintOptions={mintOptions} clmmOptions={clmmOptions} />
}
