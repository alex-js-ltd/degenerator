import { useMemo } from 'react'
import { useTokenAccountData } from '@/app/hooks/use_token_account_data'

export function useBalance(mint: string | undefined) {
	const { data } = useTokenAccountData()

	return useMemo(
		() => data?.find(account => account.mint === mint)?.balance.toString(),
		[data, mint],
	)
}
