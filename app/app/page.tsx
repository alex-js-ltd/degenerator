import * as React from 'react'
import { TokenForm } from '@/app/comps/token_form'
import { type Raydium } from '@raydium-io/raydium-sdk-v2'
import { type SelectItemConfig } from '@/app/comps/select'
import { QuoteToken, FeeTier } from '@/app/comps/select'
import { InitialPrice } from '@/app/comps/initial_price'
import { initSdk } from '@/app/utils/raydium'
import { getClmmConfigs } from '@/app/utils/clmm'

export default async function Page() {
	return (
		<TokenForm>
			<React.Suspense fallback={<Loading />}>
				<ClmmOptions />
			</React.Suspense>
		</TokenForm>
	)
}

async function getQuoteTokenProps(raydium: Raydium) {
	const data = await raydium.fetchV3TokenList()

	const mintItems = data.mintList.reduce<SelectItemConfig[]>((acc, curr) => {
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

	return { items: mintItems, name: 'mint2' }
}

async function getFeeTierProps(raydium: Raydium) {
	const clmmConfigs = await getClmmConfigs(raydium)

	return {
		items: clmmConfigs?.map(({ id, description }) => ({
			value: id,
			children: description,
			imageProps: { src: id, alt: description },
		})),
		name: 'feeTierId',
	}
}

async function ClmmOptions() {
	const raydium = await initSdk({})

	const quote = getQuoteTokenProps(raydium)
	const fee = getFeeTierProps(raydium)

	const [quoteProps, feeProps] = await Promise.all([quote, fee])

	return (
		<React.Fragment>
			<QuoteToken {...quoteProps} />
			<FeeTier {...feeProps} />
		</React.Fragment>
	)
}

function Loading() {
	return (
		<React.Fragment>
			<div className="w-[124px] h-[32px] rounded bg-slate-700 animate-pulse" />
			<div className="w-[124px] h-[32px] rounded bg-slate-700 animate-pulse" />
		</React.Fragment>
	)
}
