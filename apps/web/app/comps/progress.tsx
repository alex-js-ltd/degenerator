'use client'

import React from 'react'
import * as RadixProgress from '@radix-ui/react-progress'

export function Progress({ progress }: { progress: number }) {
	return (
		<div className="flex flex-col gap-2">
			<RadixProgress.Root
				className="relative overflow-hidden bg-gray-100 rounded-full w-full h-[25px]"
				style={{
					// Fix overflow clipping in Safari
					// https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
					transform: 'translateZ(0)',
				}}
				value={progress}
			>
				<RadixProgress.Indicator
					className="bg-teal-300 border-gray-300 w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
					style={{ transform: `translateX(-${100 - progress}%)` }}
				/>
			</RadixProgress.Root>

			<span className="z-50 text-teal-300 text-xs ml-auto">
				<span className="z-50 text-teal-300 text-xs ml-auto">
					{`bonding curve progress ${progress.toFixed(2)}%`}
				</span>
			</span>
		</div>
	)
}
