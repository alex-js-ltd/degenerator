'use client'
import { useYourTokens } from '@/app/hooks/use_your_tokens'
import { TokenGrid, Fallback } from './token_grid'

export function YourTokens() {
	const { isLoading, data } = useYourTokens()

	if (isLoading) return <Fallback />

	return data ? <TokenGrid {...data} /> : null
}
