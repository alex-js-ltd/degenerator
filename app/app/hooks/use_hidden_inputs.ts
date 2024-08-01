import { type InputProps } from '@/app/comps/input'
import { useMemo } from 'react'

export function useHiddenInputs(
	payer?: string,
	mintA?: string,
	poolId?: string,
): InputProps[] {
	return useMemo(
		() => [
			{ name: 'payerKey', defaultValue: payer, type: 'hidden' },
			{ name: 'mintA', defaultValue: mintA, type: 'hidden' },
			{ name: 'poolId', defaultValue: poolId, type: 'hidden' },
			{ name: 'amount', defaultValue: 0.1, type: 'hidden' },
		],
		[payer, mintA, poolId],
	)
}
