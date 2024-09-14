import { type ReactNode } from 'react'
import { Background } from '@/app/comps/background'

interface LayoutProps {
	children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
	return (
		<main className="flex-1 min-h-[100vh]">
			<Background>{children}</Background>
		</main>
	)
}
