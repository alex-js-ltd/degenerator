import { useTokenAccountData } from './use_token_account_data'
import { NATIVE_MINT, NATIVE_MINT_2022 } from '@solana/spl-token'
import { CompoundSelect } from '@/app/comps/select'
import { useMemo } from 'react'
import { useWallet } from '@jup-ag/wallet-adapter'

export function useMintList({ items }: Omit<CompoundSelect, 'name'>) {
	const { data } = useTokenAccountData()
	const { publicKey } = useWallet()

	return useMemo(() => {
		if (!publicKey) return items

		// Convert to Set for efficient lookup
		const inWalletSet = new Set([
			...(data?.map(el => el.mint.toBase58()) ?? []),
			NATIVE_MINT.toBase58(),
			NATIVE_MINT_2022.toBase58(),
		])

		// Filter items based on presence in the wallet
		return items.filter(item => inWalletSet.has(item.value))
	}, [data, publicKey, items])
}
