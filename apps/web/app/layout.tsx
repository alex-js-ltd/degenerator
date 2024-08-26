import { type Metadata } from 'next'
import { type ReactNode } from 'react'
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
						{children}
						<ToastTxs />
						<Footer />
					</AppProviders>
				</div>
			</body>
		</html>
	)
}
