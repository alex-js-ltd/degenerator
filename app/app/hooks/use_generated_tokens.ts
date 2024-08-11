import { useEffect } from 'react'
import { useAsync } from '@/app/hooks/use_async'
import { usePayer } from '@/app/hooks/use_payer'
import { preload, getGeneratedTokens } from '@/app/actions/generated'

type GeneratedTokens = Awaited<ReturnType<typeof getGeneratedTokens>>

export function useGeneratedTokens() {
	const pk = usePayer()
	const { run, ...rest } = useAsync<GeneratedTokens>()

	useEffect(() => {
		if (pk) {
			preload(pk)
			run(getGeneratedTokens(pk))
		}
	}, [pk])

	return { ...rest }
}
