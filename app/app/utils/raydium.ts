'use server'

import invariant from 'tiny-invariant'
import { connection } from '@/app/utils/setup'
import { PublicKey } from '@solana/web3.js'
import { Raydium, DEV_API_URLS, API_URLS } from '@raydium-io/raydium-sdk-v2'

import { getEnv } from '@/app/utils/env'

const { CLUSTER } = getEnv()

const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : 'devnet'

const BASE_HOST =
	CLUSTER === 'devnet' ? DEV_API_URLS.BASE_HOST : API_URLS.BASE_HOST

async function initSdk({
	owner,
	loadToken,
}: {
	owner?: PublicKey
	loadToken?: boolean
}) {
	const raydium = await Raydium.load({
		owner,
		connection,
		cluster,
		disableFeatureCheck: true,
		disableLoadToken: loadToken,
		blockhashCommitment: 'finalized',

		urlConfigs: {
			BASE_HOST,
		},
	})

	invariant(raydium, 'Failed to initialize raydium')

	return raydium
}

async function getClmmConfigs(raydium: Raydium) {
	const clmmConfigs =
		cluster === 'mainnet' ? await raydium.api.getClmmConfigs() : devConfigs

	invariant(clmmConfigs, 'Failed to fetch clmmConfigs')

	return clmmConfigs
}

const devConfigs = [
	{
		id: 'CQYbhr6amxUER4p5SC44C63R4qw4NFc9Z4Db9vF4tZwG',
		index: 0,
		protocolFeeRate: 120000,
		tradeFeeRate: 100,
		tickSpacing: 10,
		fundFeeRate: 40000,
		description: 'Best for very stable pairs',
		defaultRange: 0.005,
		defaultRangePoint: [0.001, 0.003, 0.005, 0.008, 0.01],
	},
	{
		id: 'B9H7TR8PSjJT7nuW2tuPkFC63z7drtMZ4LoCtD7PrCN1',
		index: 1,
		protocolFeeRate: 120000,
		tradeFeeRate: 2500,
		tickSpacing: 60,
		fundFeeRate: 40000,
		description: 'Best for most pairs',
		defaultRange: 0.1,
		defaultRangePoint: [0.01, 0.05, 0.1, 0.2, 0.5],
	},
	{
		id: 'GjLEiquek1Nc2YjcBhufUGFRkaqW1JhaGjsdFd8mys38',
		index: 3,
		protocolFeeRate: 120000,
		tradeFeeRate: 10000,
		tickSpacing: 120,
		fundFeeRate: 40000,
		description: 'Best for exotic pairs',
		defaultRange: 0.1,
		defaultRangePoint: [0.01, 0.05, 0.1, 0.2, 0.5],
	},
	{
		id: 'GVSwm4smQBYcgAJU7qjFHLQBHTc4AdB3F2HbZp6KqKof',
		index: 2,
		protocolFeeRate: 120000,
		tradeFeeRate: 500,
		tickSpacing: 10,
		fundFeeRate: 40000,
		description: 'Best for tighter ranges',
		defaultRange: 0.1,
		defaultRangePoint: [0.01, 0.05, 0.1, 0.2, 0.5],
	},
]

export { initSdk, getClmmConfigs }
