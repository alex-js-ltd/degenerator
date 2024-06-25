import {
	Raydium,
	TxVersion,
	WSOLMint,
	RAYMint,
	USDCMint,
	OPEN_BOOK_PROGRAM,
	DEVNET_PROGRAM_ID,
	MARKET_STATE_LAYOUT_V3,
	AMM_V4,
	FEE_DESTINATION_ID,
	parseTokenAccountResp,
} from '@raydium-io/raydium-sdk-v2'
import { useCallback } from 'react'
import { useWallet, useConnection } from '@jup-ag/wallet-adapter'
import { getEnv } from '@/app/utils/env'
import { Connection, type PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'

const { CLUSTER, ENDPOINT } = getEnv()

const txVersion = TxVersion.V0 // or TxVersion.LEGACY

export function useRaydium() {
	const { signAllTransactions } = useWallet()
	const { connection } = useConnection()

	const initSdk = useCallback(
		async ({ owner, loadToken }: { owner: PublicKey; loadToken?: boolean }) => {
			const cluster = CLUSTER === 'mainnet-beta' ? 'mainnet' : CLUSTER

			let raydium = await Raydium.load({
				owner,
				connection,
				cluster,
				disableFeatureCheck: true,
				disableLoadToken: loadToken,
				blockhashCommitment: 'finalized',
				signAllTransactions,
			})

			raydium.account.updateTokenAccount(
				await fetchTokenAccountData({ owner, connection }),
			)
			connection.onAccountChange(owner, async () => {
				raydium!.account.updateTokenAccount(
					await fetchTokenAccountData({ owner, connection }),
				)
			})

			return raydium
		},
		[connection, signAllTransactions],
	)

	const createMarket = useCallback(
		async (params: {
			raydium: Raydium
			baseMint: PublicKey
			baseDecimals: number
		}) => {
			const { raydium, baseMint, baseDecimals } = params

			const dexProgramId =
				CLUSTER === 'mainnet-beta'
					? OPEN_BOOK_PROGRAM
					: DEVNET_PROGRAM_ID.OPENBOOK_MARKET

			const { execute, extInfo, transactions } = await raydium.marketV2.create({
				baseInfo: {
					mint: baseMint,
					decimals: baseDecimals,
				},
				quoteInfo: {
					mint: WSOLMint,
					decimals: 9,
				},
				lotSize: 1,
				tickSize: 0.01,
				dexProgramId,
				// dexProgramId: DEVNET_PROGRAM_ID.OPENBOOK_MARKET, // devnet
				txVersion,
				// optional: set up priority fee here
				// computeBudgetConfig: {
				//   units: 600000,
				//   microLamports: 100000000,
				// },
			})

			console.log(
				`create market total ${transactions.length} txs, market info: `,
				Object.keys(extInfo.address).reduce(
					(acc, cur) => ({
						...acc,
						[cur]:
							extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
					}),
					{},
				),
			)

			try {
				const txIds = await execute({
					// set sequentially to true means tx will be sent when previous one confirmed
					sequentially: true,
				})
				console.log('create market txIds:', txIds)
			} catch (error) {
				console.log(error)
			}

			console.log('marketId', extInfo.address.marketId.toBase58())
			return extInfo.address.marketId
		},
		[],
	)

	const createAmmPool = useCallback(
		async (params: {
			raydium: Raydium
			marketId: PublicKey
			baseMint: PublicKey
			baseDecimals: number
		}) => {
			const { raydium, marketId, baseMint, baseDecimals } = params
			// if you are confirmed your market info, don't have to get market info from rpc below
			const marketBufferInfo = await raydium.connection.getAccountInfo(marketId)
			console.log(marketBufferInfo)

			const { execute, extInfo } = await raydium.liquidity.createPoolV4({
				programId: AMM_V4,
				// programId: DEVNET_PROGRAM_ID.AmmV4, // devnet
				marketInfo: {
					marketId,
					programId: OPEN_BOOK_PROGRAM,
					// programId: DEVNET_PROGRAM_ID.OPENBOOK_MARKET, // devent
				},
				baseMintInfo: {
					mint: baseMint,
					decimals: baseDecimals,
				},
				quoteMintInfo: {
					mint: WSOLMint,
					decimals: 9,
				},
				baseAmount: new BN(10),
				quoteAmount: new BN(10),

				// sol devnet faucet: https://faucet.solana.com/
				// baseAmount: new BN(4 * 10 ** 9), // if devent pool with sol/wsol, better use amount >= 4*10**9
				// quoteAmount: new BN(4 * 10 ** 9), // if devent pool with sol/wsol, better use amount >= 4*10**9

				startTime: new BN(0), // unit in seconds
				ownerInfo: {
					useSOLBalance: true,
				},
				associatedOnly: false,
				txVersion,
				feeDestinationId: FEE_DESTINATION_ID,
				// feeDestinationId: DEVNET_PROGRAM_ID.FEE_DESTINATION_ID, // devnet
				// optional: set up priority fee here
				// computeBudgetConfig: {
				//   units: 600000,
				//   microLamports: 10000000,
				// },
			})

			// don't want to wait confirm, set sendAndConfirm to false or don't pass any params to execute
			const { txId } = await execute({ sendAndConfirm: true })
			console.log(
				'amm pool created! txId: ',
				txId,
				', poolKeys:',
				Object.keys(extInfo.address).reduce(
					(acc, cur) => ({
						...acc,
						[cur]:
							extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
					}),
					{},
				),
			)
		},
		[],
	)

	return { initSdk, createMarket, createAmmPool }
}

export const fetchTokenAccountData = async (params: {
	owner: PublicKey
	connection: Connection
}) => {
	const { owner, connection } = params
	const solAccountResp = await connection.getAccountInfo(owner)
	const tokenAccountResp = await connection.getTokenAccountsByOwner(owner, {
		programId: TOKEN_PROGRAM_ID,
	})
	const token2022Req = await connection.getTokenAccountsByOwner(owner, {
		programId: TOKEN_2022_PROGRAM_ID,
	})
	const tokenAccountData = parseTokenAccountResp({
		owner: owner,
		solAccountResp,
		tokenAccountResp: {
			context: tokenAccountResp.context,
			value: [...tokenAccountResp.value, ...token2022Req.value],
		},
	})
	return tokenAccountData
}
