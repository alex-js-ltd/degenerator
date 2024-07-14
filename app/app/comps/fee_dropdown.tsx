'use server'

import { FeeTier } from '@/app/comps/select'
import { initSdk } from '@/app/utils/raydium'
import { getClmmConfigs } from '@/app//utils/clmm'

export async function getFeeTierProps() {
	const raydium = await initSdk({})

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

export async function FeeDropdown() {
	const props = await getFeeTierProps()

	return props ? <FeeTier {...props} /> : null
}
