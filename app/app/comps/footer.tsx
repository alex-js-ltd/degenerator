import React from 'react'
import { Icon } from './_icon'
import Link from 'next/link'

export function Footer() {
	return (
		<footer className="fixed bottom-0 right-0 z-50 items-center justify-between px-4 pt-1 text-white mix-blend-difference hidden sm:inline-flex pb-2">
			<nav className="flex items-center gap-2.5 rounded-full text-xs font-medium">
				<Link
					href={`https://x.com/home`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Icon
						name="twitter"
						className="size-6 text-gray-800 hover:text-teal-300"
					/>
				</Link>
			</nav>
		</footer>
	)
}
