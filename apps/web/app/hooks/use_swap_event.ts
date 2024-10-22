import { program } from '@/app/utils/setup'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useSwapEvent(mint: string) {
	const router = useRouter()

	useEffect(() => {
		const eventListenerId = program.addEventListener('swapEvent', event => {
			console.log('Swap Event:', event)
			// Handle the event data as needed
			if (event.mint.toBase58() === mint) {
				router.refresh()
			}
		})

		// Cleanup function to remove the event listener
		return () => {
			program.removeEventListener(eventListenerId)
		}
	}, [mint])
}
