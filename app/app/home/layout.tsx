import { type ReactNode } from 'react'

interface LayoutProps {
	children: ReactNode
	form: ReactNode
	dashboard: ReactNode
}

export default function Layout({ children, form, dashboard }: LayoutProps) {
	return (
		<>
			{children}
			{form}
			{dashboard}
		</>
	)
}
