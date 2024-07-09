import { type ApiV3TokenRes, type ApiV3Token } from '@raydium-io/raydium-sdk-v2'
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

const popularTokens: ApiV3Token[] = [
	{
		chainId: 101,
		address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
		programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
		logoURI:
			'https://img-v1.raydium.io/icon/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v.png',
		symbol: 'USDC',
		name: 'USD Coin',
		decimals: 6,
		tags: ['hasFreeze'],
		extensions: {},
	},

	{
		chainId: 101,
		address: 'So11111111111111111111111111111111111111112',
		programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
		logoURI:
			'https://img-v1.raydium.io/icon/So11111111111111111111111111111111111111112.png',
		symbol: 'WSOL',
		name: 'Wrapped SOL',
		decimals: 9,
		tags: [],
		extensions: {},
	},

	{
		chainId: 101,
		address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
		programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
		logoURI:
			'https://img-v1.raydium.io/icon/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R.png',
		symbol: 'RAY',
		name: 'Raydium',
		decimals: 6,
		tags: [],
		extensions: {},
	},
	{
		chainId: 101,
		address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
		programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
		logoURI:
			'https://img-v1.raydium.io/icon/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB.png',
		symbol: 'USDT',
		name: 'USDT',
		decimals: 6,
		tags: ['hasFreeze'],
		extensions: {},
	},
]
