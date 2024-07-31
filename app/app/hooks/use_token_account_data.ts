import {
	type TokenAccount,
	parseTokenAccountResp,
} from '@raydium-io/raydium-sdk-v2'
import { type PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { connection } from '@/app/utils/setup'
import { useAsync } from './use_async'
import { useEffect } from 'react'
import { useWallet } from '@jup-ag/wallet-adapter'

export function useTokenAccountData() {
	const { publicKey: pk } = useWallet()
	const { run, ...rest } = useAsync<TokenAccount[]>()

	useEffect(() => {
		if (pk) run(fetchTokenAccountData(pk))
	}, [pk])

	return { ...rest }
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
	return tokenAccountData.tokenAccounts
}
