import { fetchEvents } from '@repo/degenerator'
import { program } from '@/app/utils/setup'

import { useEffect, useMemo, useState } from 'react'

export function useProgress(mint: string) {
	const _mint = useMemo(() => mint, [mint])

	const [progress, setProgress] = useState(0)

	useEffect(() => {
		const eventListenerId = program.addEventListener('swapEvent', event => {
			console.log('Swap Event:', event)
			// Handle the event data as needed
			if (event.mint.toBase58() === mint) {
				setProgress(event.progress)
			}
		})

		// Cleanup function to remove the event listener
		return () => {
			program.removeEventListener(eventListenerId)
		}
	}, [_mint])

	return { progress }
}
