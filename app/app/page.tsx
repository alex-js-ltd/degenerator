'use server'

import { TokenForm } from '@/app/comps/token_form'
import { type Raydium } from '@raydium-io/raydium-sdk-v2'
import { type SelectItemConfig } from '@/app/comps/select'
import { QuoteToken, FeeTier } from '@/app/comps/select'
import { initSdk } from '@/app/utils/raydium'
import { getClmmConfigs } from '@/app/utils/clmm'
import { Suspense } from 'react'

export default async function Page() {
	return (
		<TokenForm>
			<Suspense fallback={<Loading />}>
				<ClmmOptions />
			</Suspense>
		</TokenForm>
	)
}

async function getQuoteTokenProps(raydium: Raydium) {
	'use server'

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
	'use server'

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
		<fieldset className="flex gap-2 w-full">
			<QuoteToken {...quoteProps} />
			<FeeTier {...feeProps} />
		</fieldset>
	)
}

function Loading() {
	return (
		<div className="flex gap-2 w-full animate-pulse">
			<div className="w-32 h-[32px] rounded bg-slate-700" />
			<div className="w-32 h-[32px] rounded bg-slate-700" />
		</div>
	)
}
