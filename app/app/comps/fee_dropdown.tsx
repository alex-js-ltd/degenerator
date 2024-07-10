import { type SelectItemConfig } from '@/app/comps/select'
import { connection } from '@/app/utils/setup'
import { getEnv } from '@/app/utils/env'
import { Raydium } from '@raydium-io/raydium-sdk-v2'
import { getClmmConfigs } from '@/app/utils/clmm'
import { FeeTier } from '@/app/comps/select'

const { CLUSTER } = getEnv()
const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

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

	return {
		items: clmmConfigs.map(({ id, description }) => ({
			value: id,
			children: description,
			imageProps: { src: id, alt: description },
		})),
		name: 'feeTier',
	}
}

export async function FeeDropdown() {
	return <FeeTier {...await getFeeTierProps()} />
}
