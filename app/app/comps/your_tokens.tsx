'use client'
import { useYourTokens } from '../hooks/use_your_tokens'
import { TokenGrid } from './token_grid'

export function YourTokens() {
	const { data } = useYourTokens()

	return data ? <TokenGrid {...data} /> : null
}
