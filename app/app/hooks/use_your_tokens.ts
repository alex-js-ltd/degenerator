import { useEffect } from 'react'
import { useAsync } from '@/app/hooks/use_async'
import { usePayer } from '@/app/hooks/use_payer'
import { type TokenMetadata } from '@prisma/client'

interface Data {
	data: TokenMetadata[]
}

export async function fetchYourTokens(id: string): Promise<Data> {
	const res = await fetch(`api/user/${id}`)
	const data = res.json()
	return data
}

export function useYourTokens() {
	const pk = usePayer()
	const { run, ...rest } = useAsync<Data>()

	useEffect(() => {
		if (pk) run(fetchYourTokens(pk))
	}, [pk])

	return { ...rest }
}
