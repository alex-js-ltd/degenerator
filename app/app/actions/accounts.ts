'use server'

import { PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { connection } from '@/app/utils/setup'
import { cache } from 'react'

interface Account {
	mint: string
	balance: number
	decimals: number
}

async function fetchAllTokens(pk: PublicKey) {
	const [tokenAccounts, token2022Accounts] = await Promise.all(
		[TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID].map(tokenProgramId =>
			connection.getParsedTokenAccountsByOwner(
				pk,
				{ programId: tokenProgramId },
				'confirmed',
			),
		),
	)

	const reducedResult = [
		...tokenAccounts.value,
		...token2022Accounts.value,
	].reduce<Account[]>((acc, curr) => {
		const parsedAccountInfo = curr.account.data
		const mint: string = parsedAccountInfo['parsed']['info']['mint']
		const balance: number =
			parsedAccountInfo['parsed']['info']['tokenAmount']['uiAmount']
		const decimals: number =
			parsedAccountInfo['parsed']['info']['tokenAmount']['decimals']

		acc.push({ mint, balance, decimals })

		return acc
	}, [])

	return reducedResult
}

export const preload = (pk: string) => {
	void getTokenAccountData(pk)
}

export const getTokenAccountData = cache(async (pk: string) => {
	const tokenAccounts = await fetchAllTokens(new PublicKey(pk))
	return tokenAccounts
})
