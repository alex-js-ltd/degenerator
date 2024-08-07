import { useEffect } from 'react'
import { useAsync } from '@/app/hooks/use_async'
import { usePayer } from '@/app/hooks/use_payer'
import { preload, getTokenAccountData } from '@/app/actions/accounts'

type TokenAccountData = Awaited<ReturnType<typeof getTokenAccountData>>

export function useTokenAccountData() {
	const pk = usePayer()
	const { run, data, ...rest } = useAsync<TokenAccountData>()

	console.log(data)
	useEffect(() => {
		if (pk) {
			preload(pk)
			run(getTokenAccountData(pk))
		}
	}, [pk])

	return { ...rest, data }
}
