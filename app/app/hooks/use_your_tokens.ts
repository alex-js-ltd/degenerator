import { useEffect } from 'react'
import { useAsync } from '@/app/hooks/use_async'
import { usePayer } from '@/app/hooks/use_payer'
import { preload, getYourTokens } from '@/app/data/your_tokens'

type YourTokens = Awaited<ReturnType<typeof getYourTokens>>

export function useYourTokens() {
	const pk = usePayer()
	const { run, ...rest } = useAsync<YourTokens>()

	useEffect(() => {
		if (pk) {
			preload(pk)
			run(getYourTokens(pk))
		}
	}, [pk])

	return { ...rest }
}
