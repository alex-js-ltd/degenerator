'use server'

import { ClmmConfigInfo } from '@raydium-io/raydium-sdk-v2'
import invariant from 'tiny-invariant'

interface ClmmConfig extends Omit<ClmmConfigInfo, 'id'> {
	id: string // Change the type of id
}

export async function getClmmConfig(): Promise<ClmmConfig[]> {
	const res = await fetch('https://api-v3.raydium.io/main/clmm-config')

	invariant(res.ok, 'Failed to fetch data')

	const data = await res.json()

	return data.data
}

export async function getFeeTierProps() {
	const clmmConfigs = await getClmmConfig()

	return {
		items: clmmConfigs?.map(({ id, description }) => ({
			value: id,
			children: description,
			imageProps: { src: id, alt: description },
		})),
		name: 'feeTier',
	}
}
