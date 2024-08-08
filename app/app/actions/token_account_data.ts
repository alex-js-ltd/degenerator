'use server'

import { parseWithZod } from '@conform-to/zod'
import { TokenAccountDataSchema } from '@/app/utils/schemas'
import { parseTokenAccountResp } from '@raydium-io/raydium-sdk-v2'
import { type PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { connection } from '@/app/utils/setup'
import invariant from 'tiny-invariant'

export async function tokenAccountData(
	_prevState: unknown,
	formData: FormData,
) {
	const submission = parseWithZod(formData, {
		schema: TokenAccountDataSchema,
	})

	invariant(submission.status === 'success')

	const { payerKey } = submission.value

	const tokenAccounts = await fetchTokenAccountData(payerKey)

	return tokenAccounts
}

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
