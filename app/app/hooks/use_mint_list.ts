import { useMemo } from 'react'
import { usePool } from '@/app/context/pool_context'
import { useTokenAccountData } from '@/app/hooks/use_token_account_data'
import { useWallet } from '@jup-ag/wallet-adapter'
import { NATIVE_MINT, NATIVE_MINT_2022 } from '@solana/spl-token'

export function useMintList() {
	const { items } = usePool()
	const { data } = useTokenAccountData()
	const { publicKey } = useWallet()

	return useMemo(() => {
		const inWalletSet = new Set([
			...(data?.map(el => el.mint) || []),
			NATIVE_MINT.toBase58(),
			NATIVE_MINT_2022.toBase58(),
		])

		const filteredItems = items.filter(item => inWalletSet.has(item.value))

		return publicKey ? filteredItems : items
	}, [data, publicKey, items])
}
