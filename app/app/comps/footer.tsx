import React from 'react'
import { Icon } from './_icon'
import Link from 'next/link'

export function Footer() {
	return (
		<footer className="fixed bottom-0 right-0 z-50 items-center justify-between px-4 pt-1 text-white  hidden sm:inline-flex pb-2">
			<nav className="flex items-center gap-2.5 rounded-full text-xs font-medium">
				<Link className="text-gray-900  hover:text-teal-300" href="/faq">
					FAQ
				</Link>
				<Link
					href={`https://x.com/degenerato2774`}
					target="_blank"
					rel="noopener noreferrer"
					className="size-6 flex items-center justify-center"
				>
					<Icon
						name="twitter"
						className="size-3 text-gray-800 hover:text-teal-300"
					/>
				</Link>
			</nav>
		</footer>
	)
}
