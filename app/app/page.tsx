import { TokenForm } from '@/app/comps/token_form'
import { type Raydium } from '@raydium-io/raydium-sdk-v2'
import { type SelectItemConfig } from '@/app/comps/select'
import { QuoteToken, FeeTier } from '@/app/comps/select'
import { initSdk } from '@/app/utils/raydium'
import { getClmmConfigs } from '@/app/utils/clmm'

export default async function Page() {
	const raydium = await initSdk({})

	return (
		<TokenForm>
			<QuoteToken {...await getQuoteTokenProps({ raydium })} />
			<FeeTier {...await getFeeTierProps({ raydium })} />
		</TokenForm>
	)
}

async function getQuoteTokenProps({ raydium }: { raydium: Raydium }) {
	const data = await raydium.fetchV3TokenList()

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

async function getFeeTierProps({ raydium }: { raydium: Raydium }) {
	const clmmConfigs = await getClmmConfigs({ raydium })

	return {
		items: clmmConfigs?.map(({ id, description }) => ({
			value: id,
			children: description,
			imageProps: { src: id, alt: description },
		})),
		name: 'feeTier',
	}
}
