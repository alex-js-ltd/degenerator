import { useEffect } from 'react'
import { useAsync } from '@/app/hooks/use_async'
import { usePayer } from '@/app/hooks/use_payer'
import { preload, getBalance } from '@/app/actions/balance'

export function useBalance() {
	const pk = usePayer()
	const { run, data, ...rest } = useAsync<number>()

	useEffect(() => {
		if (pk) {
			preload(pk)
			run(getBalance(pk))
		}
	}, [pk])

	return { ...rest, data }
}
