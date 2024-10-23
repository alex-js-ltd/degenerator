import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { PublicKey } from '@solana/web3.js'
import { connection } from '@/app/utils/setup'

export function useSwapEvent(mint: string) {
	const router = useRouter()

	const _mint = useMemo(() => new PublicKey(mint), [mint])

	useEffect(() => {
		const subscriptionId = connection.onAccountChange(_mint, () =>
			router.refresh(),
		)
	}, [router, _mint])
}
