import React, { FC } from 'react'
import { Icon } from './_icon'

interface SwitchProps {
	on: boolean
	className?: string
	'aria-label'?: string
	onClick: (
		event: React.MouseEvent<HTMLInputElement | HTMLButtonElement>,
	) => void
}

const noop = () => {}

function Switch({
	on,
	className = '',
	'aria-label': ariaLabel,
	onClick,
	...props
}: SwitchProps) {
	const btnClassName = [
		className,
		'toggle-btn',
		on ? 'toggle-btn-on' : 'toggle-btn-off',
	]
		.filter(Boolean)
		.join(' ')

	const toggleBtnOn =
		'absolute hidden h-7 rounded-md bg-gray-700 transition-all animate-in fade-in sm:block right-[50%] w-[calc(50%-2px)]'
	const toggleBtnOff =
		'absolute hidden h-7 rounded-md bg-gray-700 transition-all animate-in fade-in sm:block right-[2px] w-[calc(50%-2px)]'

	return (
		<div
			className="flex items-center group relative h-8 cursor-pointer gap-0 rounded-lg bg-gray-800 p-0.5 duration-200"
			style={{ outline: 'none' }}
		>
			<div className={on ? toggleBtnOn : toggleBtnOff} />

			<button
				onClick={onClick}
				type="button"
				className="inline-flex items-center justify-center whitespace-nowrap px-3 text-sm font-medium text-gray-500 ring-offset-white hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-7 rounded-md transition-[colors,opacity] group-hover:text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white sm:data-[state=active]:bg-gray-800"
			>
				<div className="z-10 flex items-center w-full h-full">
					<Icon name="mint-toggle" className="h-4 w-4 text-teal-300" />
					<div className="overflow-hidden text-left  sm:block sm:w-[52px] w-0">
						<span className="ml-1">Revoke Mint</span>
					</div>
				</div>
			</button>

			<button
				onClick={onClick}
				type="button"
				className="inline-flex items-center justify-center whitespace-nowrap px-3 text-sm font-medium text-gray-500 ring-offset-white hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-7 rounded-md transition-[colors,opacity] group-hover:text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white sm:data-[state=active]:bg-gray-800"
			>
				<div className="z-10 flex items-center">
					<Icon name="mint-toggle" className="h-4 w-4" />
					<div className="overflow-hidden text-left  sm:block sm:w-[52px] w-[52px]">
						<span className="ml-1">Control Mint</span>
					</div>
				</div>
			</button>
		</div>
	)
}

export { Switch }
