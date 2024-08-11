import { type ReactNode } from 'react'

interface LayoutProps {
	children: ReactNode
	form: ReactNode
	explore: ReactNode
}

export default function Layout({ children, form, explore }: LayoutProps) {
	return (
		<main className="flex-1">
			{children}
			{form}
			{explore}
		</main>
	)
}
