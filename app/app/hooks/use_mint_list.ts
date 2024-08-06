import { useTokenAccountData } from './use_token_account_data'
import { NATIVE_MINT, NATIVE_MINT_2022 } from '@solana/spl-token'
import { SelectItemConfig } from '@/app/comps/select'
import { useMemo } from 'react'
import { useWallet } from '@jup-ag/wallet-adapter'

export function useMintList(items: SelectItemConfig[]) {
	const { data } = useTokenAccountData()
	const { publicKey } = useWallet()

	return useMemo(() => {
		if (!publicKey) return items

		const inWalletSet = new Set(
			data
				?.map(el => el.mint.toBase58())
				.concat(NATIVE_MINT.toBase58())
				.concat(NATIVE_MINT_2022.toBase58()),
		)

		// Filter items based on presence in the wallet
		return items.filter(item => inWalletSet.has(item.value))
	}, [data, publicKey, items])
}
