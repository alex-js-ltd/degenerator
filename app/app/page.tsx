import { type ApiV3TokenRes } from '@raydium-io/raydium-sdk-v2'
import { type SelectFieldProps } from '@/app/comps/select'
import invariant from 'tiny-invariant'
import { Form } from '@/app/comps/form'
import { connection } from '@/app/utils/setup'
import { getEnv } from '@/app/utils/env'
import { Raydium } from '@raydium-io/raydium-sdk-v2'

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

	const mintItems = data.mintList.reduce<SelectFieldProps['items']>(
		(acc, curr) => {
			const { address, name, logoURI, symbol } = curr

			const option = {
				value: address,
				children: symbol,
				symbol,
				imageProps: { src: logoURI, alt: symbol },
			}

			if (name) acc.push(option)

			return acc
		},
		[],
	)

	const clmmConfigs = await getClmmConfigs()

	const clmmItems = clmmConfigs.reduce<SelectFieldProps['items']>(
		(acc, curr) => {
			const { id, description } = curr

			const option = {
				value: id,
				children: description,
				imageProps: { src: id, alt: id },
			}

			acc.push(option)

			return acc
		},
		[],
	)

	return <Form mintItems={mintItems} clmmItems={clmmItems} />
}
