import { type ApiV3TokenRes } from '@raydium-io/raydium-sdk-v2'
import { type SelectItemConfig } from '@/app/comps/select'
import invariant from 'tiny-invariant'
import { TokenForm } from '@/app/comps/token_form'
import { connection } from '@/app/utils/setup'
import { getEnv } from '@/app/utils/env'
import { Raydium } from '@raydium-io/raydium-sdk-v2'
import { ClmmForm } from '@/app/comps/clmm_form'
import { getClmmConfigs } from '@/app/utils/clmm'

const { CLUSTER } = getEnv()
const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

async function getApiV3TokenList(): Promise<ApiV3TokenRes> {
	const res = await fetch('https://api-v3.raydium.io/mint/list')

	invariant(res.ok, 'Failed to fetch data')

	const data = await res.json()

	return data.data
}

export default async function Page() {
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

	const raydium = await Raydium.load({
		owner: undefined,
		connection,
		cluster,
		disableFeatureCheck: true,
		blockhashCommitment: 'finalized',
	})

	const clmmConfigs = await getClmmConfigs({ raydium })

	const clmmItems = clmmConfigs.reduce<SelectItemConfig[]>((acc, curr) => {
		const { id, description } = curr

		const option = {
			value: id,
			children: description,
			imageProps: { src: id, alt: id },
		}

		acc.push(option)

		return acc
	}, [])

	return (
		<TokenForm
			children={<ClmmForm mintItems={mintItems} clmmItems={clmmItems} />}
		/>
	)
}
