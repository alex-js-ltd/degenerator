import { useMemo } from 'react'
import { useTokenAccountData } from '@/app/hooks/use_token_account_data'
import { useWallet } from '@jup-ag/wallet-adapter'
import { NATIVE_MINT, NATIVE_MINT_2022 } from '@solana/spl-token'
import { SelectItemConfig } from '../comps/select'

export function useMintList(items: SelectItemConfig[]) {
	const { data } = useTokenAccountData()
	const { publicKey } = useWallet()

	return useMemo(() => {
		const inWalletSet = new Set([
			...(data?.map(el => el.mint) || []),
			NATIVE_MINT.toBase58(),
			NATIVE_MINT_2022.toBase58(),
		])

		const itemsInWallet = items.filter(item => inWalletSet.has(item.value))
		const itemsNotInWallet = items.filter(item => !inWalletSet.has(item.value))

		return [...itemsInWallet, ...itemsNotInWallet]
	}, [data, publicKey, items])
}
