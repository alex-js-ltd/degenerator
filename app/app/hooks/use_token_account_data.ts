import { useEffect } from 'react'
import { useAsync } from '@/app/hooks/use_async'
import { usePayer } from '@/app/hooks/use_payer'
import { getTokenAccountData } from '@/app/actions/token_account_data'

interface TokenAccount {
	mint: string
	amount: string
}

export function useTokenAccountData() {
	const pk = usePayer()
	const { run, ...rest } = useAsync<TokenAccount[]>()

	useEffect(() => {
		if (pk) run(getTokenAccountData(pk))
	}, [pk])

	return { ...rest }
}
