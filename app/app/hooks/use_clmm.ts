import {
	Raydium,
	TxVersion,
	CLMM_PROGRAM_ID,
	DEVNET_PROGRAM_ID,
	TickUtils,
	PoolUtils,
	type ClmmKeys,
	type ApiV3PoolInfoConcentratedItem,
} from '@raydium-io/raydium-sdk-v2'

import { BN } from '@coral-xyz/anchor'
import Decimal from 'decimal.js'
import { PublicKey } from '@solana/web3.js'

import { connection } from '@/app/utils/setup'
import { useWallet } from '@jup-ag/wallet-adapter'
import { getEnv } from '@/app/utils/env'
import { useCallback } from 'react'
import invariant from 'tiny-invariant'

type InitSdkProps = {
	owner: PublicKey
	loadToken?: Boolean
}

type CreatePoolProps = {
	raydium: Raydium
}

type CreatePositionProps = {
	raydium: Raydium
	poolId?: PublicKey
}

const { CLUSTER } = getEnv()

const txVersion = TxVersion.V0 // or TxVersion.LEGACY

const VALID_PROGRAM_ID = new Set([
	CLMM_PROGRAM_ID.toBase58(),
	DEVNET_PROGRAM_ID.CLMM.toBase58(),
])

const isValidClmm = (id: string) => VALID_PROGRAM_ID.has(id)

export function useClmm() {
	const { signAllTransactions } = useWallet()

	const initSdk = useCallback(
		async (params: InitSdkProps) => {
			const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

			const raydium = await Raydium.load({
				owner: params.owner,
				connection,
				cluster,
				disableFeatureCheck: true,
				disableLoadToken: !params?.loadToken,
				blockhashCommitment: 'finalized',
				signAllTransactions,
				// urlConfigs: {
				//   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
				// },
			})

			return raydium
		},
		[signAllTransactions],
	)

	const createPool = useCallback(async ({ raydium }: CreatePoolProps) => {
		try {
			// you can call sdk api to get mint info or paste mint info from api: https://api-v3.raydium.io/mint/list

			// RAY
			const mint1 = await raydium.token.getTokenInfo(
				'B5QKJua8KQYTV7fMBgmCzUPcauuhhmPzD4LQbrNGn9kY',
			)

			// USDT
			const mint2 = await raydium.token.getTokenInfo(
				'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
			)

			const clmmConfigs = await raydium.api.getClmmConfigs()

			const { execute, extInfo, ...rest } = await raydium.clmm.createPool({
				programId: CLMM_PROGRAM_ID, // devnet: DEVNET_PROGRAM_ID.CLMM
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

			const { txId } = await execute()
			console.log('clmm pool created:', { txId })

			const address: ClmmKeys & { poolId?: PublicKey } = extInfo.address
			const poolId = address?.poolId
			invariant(poolId, 'poolId does not exist')
			return poolId
		} catch (error) {
			console.error('Error creating CLMM pool:', error)
		}
	}, [])

	const createPosition = useCallback(
		async ({ raydium, poolId }: CreatePositionProps) => {
			invariant(poolId, 'poolId does not exist')

			const data = await raydium.api.fetchPoolById({
				ids: poolId?.toBase58(),
			})

			const poolInfo = (data as any)[0] as ApiV3PoolInfoConcentratedItem
			if (!isValidClmm(poolInfo.programId))
				throw new Error('target pool is not CLMM pool')

			const inputAmount = 1 // RAY amount
			const [startPrice, endPrice] = [0.1, 100]

			const { tick: lowerTick } = TickUtils.getPriceAndTick({
				poolInfo,
				price: new Decimal(startPrice),
				baseIn: true,
			})

			const { tick: upperTick } = TickUtils.getPriceAndTick({
				poolInfo,
				price: new Decimal(endPrice),
				baseIn: true,
			})

			const epochInfo = await raydium.fetchEpochInfo()

			const res = await PoolUtils.getLiquidityAmountOutFromAmountIn({
				poolInfo,
				slippage: 0,
				inputA: true,
				tickUpper: Math.max(lowerTick, upperTick),
				tickLower: Math.min(lowerTick, upperTick),
				amount: new BN(
					new Decimal(inputAmount || '0')
						.mul(10 ** poolInfo.mintA.decimals)
						.toFixed(0),
				),
				add: true,
				amountHasFee: true,
				epochInfo: epochInfo,
			})

			const { execute, extInfo } = await raydium.clmm.openPositionFromBase({
				poolInfo,
				tickUpper: Math.max(lowerTick, upperTick),
				tickLower: Math.min(lowerTick, upperTick),
				base: 'MintA',
				ownerInfo: {},
				baseAmount: new BN(
					new Decimal(inputAmount || '0')
						.mul(10 ** poolInfo.mintA.decimals)
						.toFixed(0),
				),
				otherAmountMax: res.amountSlippageB.amount,
				txVersion,
				// optional: set up priority fee here
				// computeBudgetConfig: {
				//   units: 600000,
				//   microLamports: 100000000,
				// },
			})

			const { txId } = await execute()
			console.log(
				'clmm position opened:',
				{ txId },
				', nft mint:',
				extInfo.nftMint.toBase58(),
			)
		},
		[],
	)

	return { initSdk, createPool, createPosition }
}
