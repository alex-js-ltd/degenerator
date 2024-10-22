import { program } from '@/app/utils/setup'
import { useEffect, experimental_useEffectEvent } from 'react'
import { useRouter } from 'next/navigation'
import { PublicKey } from '@solana/web3.js'
import { useEventCallback } from 'usehooks-ts'

interface Event {
	mint: PublicKey
}

export function useSwapEvent(mint: string) {
	const router = useRouter()

	const handleSwapEvent = useEventCallback((event: Event) => {
		console.log('Swap Event:', event)
		// Handle the event data as needed
		if (event?.mint.toBase58() === mint) {
			router.refresh()
		}
	})

	useEffect(() => {
		// Add the event listener using the stable handler
		const eventListenerId = program.addEventListener(
			'swapEvent',
			handleSwapEvent,
		)

		return () => {
			program.removeEventListener(eventListenerId)
		}
	}, [handleSwapEvent])
}
