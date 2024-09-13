import React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

export function Switch() {
	return (
		<SwitchPrimitive.Root className="relative w-24 shrink-0 inline-flex cursor-pointer items-center justify-start gap-1.5 border font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:pointer-events-none disabled:cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-100 h-8 text-sm rounded-lg">
			<div className="absolute">Buy</div>
			<div className="absolute">Sell</div>
			<SwitchPrimitive.Thumb className="block w-12 h-8 bg-gray-200 rounded-lg transition-transform duration-100 transform translate-x-0 data-[state=checked]:translate-x-[48px]" />
		</SwitchPrimitive.Root>
	)
}
