'use server'

import { connection } from '@/app/utils/setup'
import { PublicKey } from '@solana/web3.js'
import {
	TOKEN_2022_PROGRAM_ID,
	getMint as getMintAccount,
} from '@solana/spl-token'

export async function getMint(pk: string) {
	let mintAccount = await getMintAccount(
		connection,
		new PublicKey(pk),
		'confirmed',
		TOKEN_2022_PROGRAM_ID,
	)
	return mintAccount
}
