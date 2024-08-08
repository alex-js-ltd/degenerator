import { parseTokenAccountResp } from '@raydium-io/raydium-sdk-v2'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { connection } from '@/app/utils/setup'
import { cache } from 'react'

async function fetchTokenAccountData(owner: PublicKey) {
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

	return tokenAccountData.tokenAccounts.map(el => ({
		mint: el.mint.toBase58(),
		amount: el.amount.toString(),
	}))
}

export const preload = (pk: string) => {
	void getTokenAccountData(pk)
}

export const getTokenAccountData = cache(async (pk: string) => {
	const tokenAccounts = await fetchTokenAccountData(new PublicKey(pk))
	return tokenAccounts
})
