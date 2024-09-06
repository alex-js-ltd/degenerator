import { useEffect } from 'react'
import { useAsync } from '@/app/hooks/use_async'
import { deleteToken } from '../actions/delete_token'

export function useDeleteToken(isError: boolean, mint?: string) {
	const { run, ...rest } = useAsync<string>()

	useEffect(() => {
		if (isError && mint) {
			run(deleteToken(mint))
		}
	}, [mint, isError])

	return {
		...rest,
	}
}
