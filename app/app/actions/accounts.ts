'use server'

import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import {
	TOKEN_PROGRAM_ID,
	TOKEN_2022_PROGRAM_ID,
	NATIVE_MINT,
} from '@solana/spl-token'
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

async function fetchBalance(pk: PublicKey) {
	const res = await connection.getBalance(pk)
	return res / LAMPORTS_PER_SOL
}

export const preload = (pk: string) => {
	void getTokenAccountData(pk)
}

export const getTokenAccountData = cache(async (pk: string) => {
	const account = new PublicKey(pk)
	const tokenAccounts = await fetchAllTokens(account)
	const balance = await fetchBalance(account)
	const native: Account = { mint: NATIVE_MINT.toBase58(), balance, decimals: 9 }
	return [...tokenAccounts, native]
})
