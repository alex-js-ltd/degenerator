import { type ApiV3TokenRes } from '@raydium-io/raydium-sdk-v2'
import { type SelectItemConfig } from '@/app/comps/select'
import invariant from 'tiny-invariant'
import { connection } from '@/app/utils/setup'
import { getEnv } from '@/app/utils/env'
import { Raydium } from '@raydium-io/raydium-sdk-v2'
import { getClmmConfigs } from '@/app/utils/clmm'
import { QuoteToken, FeeTier } from '@/app/comps/select'
import { Input } from './input'

const { CLUSTER } = getEnv()
const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

async function getApiV3TokenList(): Promise<ApiV3TokenRes> {
	'use server'
	const res = await fetch('https://api-v3.raydium.io/mint/list')

	invariant(res.ok, 'Failed to fetch data')

	const data = await res.json()

	return data.data
}

async function getQuoteTokenProps() {
	'use server'

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

async function getFeeTierProps() {
	'use server'

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

	return { items: clmmItems, name: 'feeTier' }
}

export async function ClmmInputs() {
	return (
		<fieldset className="flex gap-2">
			<div className="flex-1">
				<QuoteToken {...await getQuoteTokenProps()} />
			</div>

			<div className="flex-1">
				<FeeTier {...await getFeeTierProps()} />
			</div>

			<div className="flex-1">
				<Input
					placeholder="Initial Price"
					className="disabled:pointer-events-none disabled:opacity-60 inline-flex h-[32px] w-32 items-center gap-1.5 rounded-md bg-gray-800 hover:bg-gray-700/70 hover:text-gray-100 text-gray-400 text-sm px-2 transition-colors whitespace-nowrap focus:outline-none border"
				/>
			</div>
		</fieldset>
	)
}
