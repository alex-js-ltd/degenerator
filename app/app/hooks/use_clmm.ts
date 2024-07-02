import { useRaydium, txVersion } from '@/app/hooks/use_raydium'
import {
	CLMM_PROGRAM_ID,
	DEVNET_PROGRAM_ID,
	type Raydium,
} from '@raydium-io/raydium-sdk-v2'
import { PublicKey } from '@solana/web3.js'
import Decimal from 'decimal.js'
import BN from 'bn.js'
import { getEnv } from '@/app/utils/env'
import { useCallback } from 'react'

const { CLUSTER } = getEnv()

export function useClmm() {
	return useCallback(
		async ({
			raydium,
			mint1Key,
		}: {
			raydium: Raydium
			mint1Key: PublicKey
		}) => {
			// you can call sdk api to get mint info or paste mint info from api: https://api-v3.raydium.io/mint/list

			console.log(
				await raydium.token.getTokenInfo(
					'B5QKJua8KQYTV7fMBgmCzUPcauuhhmPzD4LQbrNGn9kY',
				),
			)

			// RAY
			const mint1 = await raydium.token.getTokenInfo(mint1Key)
			// USDT
			const mint2 = await raydium.token.getTokenInfo(
				'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
			)
			const mainConfigs = await raydium.api.getClmmConfigs()

			const clmmConfigs = CLUSTER === 'mainnet-beta' ? mainConfigs : devConfigs // devnet configs

			const programId =
				CLUSTER === 'mainnet-beta' ? CLMM_PROGRAM_ID : DEVNET_PROGRAM_ID.CLMM

			const { execute } = await raydium.clmm.createPool({
				programId,
				mint1,
				mint2,
				ammConfig: {
					...clmmConfigs[0],
					id: new PublicKey(clmmConfigs[0].id),
					fundOwner: '',
				},
				initialPrice: new Decimal(1),
				startTime: new BN(0),
				txVersion,
				// optional: set up priority fee here
				// computeBudgetConfig: {
				//   units: 600000,
				//   microLamports: 100000000,
				// },
			})

			// don't want to wait confirm, set sendAndConfirm to false or don't pass any params to execute
			const { txId } = await execute({ sendAndConfirm: true })
			console.log('clmm pool created:', { txId })
			return txId
		},
		[],
	)
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
