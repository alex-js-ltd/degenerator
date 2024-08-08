import { useAsync } from './use_async'
import { useEffect } from 'react'
import { usePayer } from './use_payer'
import { tokenAccountData } from '@/app/actions/token_account_data'

interface TokenAccount {
	mint: string
	amount: string
}
function getTokenAcountDataProps(payer: string): [undefined, FormData] {
	const formData = new FormData()
	formData.append('payerKey', payer)
	return [undefined, formData]
}

export function useTokenAccountData() {
	const pk = usePayer()
	const { run, ...rest } = useAsync<TokenAccount[]>()

	useEffect(() => {
		if (pk) run(tokenAccountData(...getTokenAcountDataProps(pk)))
	}, [pk])

	return { ...rest }
}
