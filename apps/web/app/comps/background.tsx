import { type ReactNode } from 'react'
import Image from 'next/image'

export function Background({ children }: { children: ReactNode }) {
	return (
		<div className="relative mb-4 flex items-center justify-center py-[26vh] pt-[18vh] text-gray-900 sm:pt-[26vh]">
			<div className="absolute inset-0 flex items-center justify-center overflow-hidden">
				<div className="relative mb-72 size-full min-w-[29rem] max-w-[96rem] sm:mb-0">
					<Image
						className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
						src="/background.svg"
						alt="background"
						fill={true}
						priority
					/>
				</div>
			</div>
			<div className="relative flex w-full flex-col items-center gap-6 px-6 text-center">
				<div className="flex w-full flex-col items-center gap-1.5">
					<h2 className="text-4xl font-semibold tracking-tighter sm:text-5xl @media(max-width:480px):text-[2rem]">
						Generate. Mint. Degen.
					</h2>

					<p>Generate SPL tokens on Solana </p>
				</div>

				{children}
			</div>
		</div>
	)
}
