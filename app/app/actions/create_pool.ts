'use server'

import { parseWithZod } from '@conform-to/zod'
import { PoolSchema } from '@/app/utils/schemas'
import { program, connection } from '@/app/utils/setup'
import { getEnv } from '@/app/utils/env'
import {
	Raydium,
	TxVersion,
	parseTokenAccountResp,
	OPEN_BOOK_PROGRAM,
	DEVNET_PROGRAM_ID,
	RAYMint,
	USDCMint,
} from '@raydium-io/raydium-sdk-v2'

import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'

const { CLUSTER } = getEnv()
const txVersion = TxVersion.V0 // or TxVersion.LEGACY

const fetchTokenAccountData = async (owner: PublicKey) => {
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

export async function createPool(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: PoolSchema,
	})

	if (submission.status !== 'success') {
		return {
			...submission.reply(),
			serializedTransactions: undefined,
		}
	}

	const { owner } = submission.value

	let raydium: Raydium | undefined
	const initSdk = async (params?: { loadToken?: boolean }) => {
		if (raydium) return raydium
		raydium = await Raydium.load({
			owner,
			connection,
			cluster: 'devnet', // 'mainnet' | 'devnet'
			disableFeatureCheck: true,
			disableLoadToken: !params?.loadToken,
			blockhashCommitment: 'finalized',
			// urlConfigs: {
			//   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
			// },
		})

		return raydium
	}

	raydium = await initSdk()

	console.log(raydium)

	const TEST_MINT = new PublicKey(
		'FotFQ4muw3vY3ZuyaMjpZYM1bCgiFJ7aDs3ZgXva2V2Y',
	)

	const { execute, extInfo, transactions, builder, signers, ...rest } =
		await raydium.marketV2.create({
			baseInfo: {
				mint: TEST_MINT,
				decimals: 4,
			},
			quoteInfo: {
				mint: USDCMint,
				decimals: 9,
			},
			lotSize: 1,
			tickSize: 0.01,
			dexProgramId: DEVNET_PROGRAM_ID.OPENBOOK_MARKET, // devnet: DEVNET_PROGRAM_ID.OPENBOOK_MARKET
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
				[cur]: extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
			}),
			{},
		),
	)

	// const txIds = await execute({
	// 	// set sequentially to true means tx will be sent when previous one confirmed
	// 	sequentially: true,
	// })

	const serializedTransactions = transactions.map(el => el.serialize())

	return {
		...submission.reply(),
		serializedTransactions,
	}
}
