import { type Metadata } from 'next'
import { type ReactNode } from 'react'
import Image from 'next/image'
import { AppProviders } from '@/app/context'
import { Header } from '@/app/comps/header'
import { ToastTxs } from '@/app/comps/toast'
import { Footer } from '@/app/comps/footer'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import './globals.css'

export const metadata: Metadata = {
	title: {
		template: '%s | Degenerator',
		default: 'Degenerator',
	},
	description: 'Generate SPL Tokens on Solana',
	metadataBase: new URL('https://www.degenerator.dev'),
}

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html className={`${GeistSans.variable} ${GeistMono.variable}`} lang="en">
			<body className="font-sans mx-h-[100vh]">
				<div className="min-h-screen-patched flex flex-col border w-full">
					<AppProviders>
						<Header />
						<Background>{children}</Background>
						<ToastTxs />

						<Footer />
					</AppProviders>
				</div>
			</body>
		</html>
	)
}
function Background({ children }: { children: ReactNode }) {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-0">
			<div className="relative mb-4 flex items-center justify-center py-[26vh] pt-[18vh] text-gray-900 sm:pt-[26vh] w-full">
				<div className="absolute inset-0 flex items-center justify-center overflow-hidden">
					<div className="relative mb-72 h-full w-full min-w-[29rem] max-w-[96rem] sm:mb-0">
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
		</main>
	)
}
