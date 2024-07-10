import { txVersion } from '@/app/hooks/use_raydium'
import {
	CLMM_PROGRAM_ID,
	DEVNET_PROGRAM_ID,
	type Raydium,
} from '@raydium-io/raydium-sdk-v2'
import { PublicKey } from '@solana/web3.js'
import Decimal from 'decimal.js'
import { BN } from '@coral-xyz/anchor'
import { getEnv } from '@/app/utils/env'
import { useCallback } from 'react'
import { getClmmConfigs } from '@/app/utils/clmm'
import invariant from 'tiny-invariant'
import { useConnection } from '@jup-ag/wallet-adapter'

const { CLUSTER } = getEnv()

export function useClmm() {
	const { connection } = useConnection()
	return useCallback(
		async ({
			raydium,
			mint1: mint1Key,
			mint2: mint2Key,
			feeTier,
		}: {
			raydium: Raydium
			mint1: PublicKey
			mint2: PublicKey
			feeTier: string
		}) => {
			// you can call sdk api to get mint info or paste mint info from api: https://api-v3.raydium.io/mint/list

			const mint1 = await raydium.token.getTokenInfo(mint1Key)
			const mint2 = await raydium.token.getTokenInfo(mint2Key)

			const clmmConfigs = await getClmmConfigs({ raydium })

			const clmmConfig = clmmConfigs.find(el => el.id === feeTier)

			invariant(clmmConfig, 'Failed to find clmmConfig')

			const programId =
				CLUSTER === 'mainnet-beta' ? CLMM_PROGRAM_ID : DEVNET_PROGRAM_ID.CLMM

			const { execute } = await raydium.clmm.createPool({
				programId,
				mint1,
				mint2,
				ammConfig: {
					...clmmConfig,
					id: new PublicKey(clmmConfig.id),
					fundOwner: '',
				},
				initialPrice: new Decimal(1),
				startTime: new BN(0),
				txVersion,
			})

			let blockhash = await connection
				.getLatestBlockhash()
				.then(res => res.blockhash)
			// don't want to wait confirm, set sendAndConfirm to false or don't pass any params to execute
			const { txId } = await execute({
				sendAndConfirm: true,
				recentBlockHash: blockhash,
			})
			console.log('clmm pool created:', { txId })
			return txId
		},
		[connection],
	)
}
