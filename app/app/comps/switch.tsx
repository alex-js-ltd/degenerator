import React, { FC } from 'react'

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
		'absolute hidden h-7 rounded-md bg-gray-700 transition-all animate-in fade-in sm:block right-[94px] w-[88px]'
	const toggleBtnOff =
		'absolute hidden h-7 rounded-md bg-gray-700 transition-all animate-in fade-in sm:block right-[2px] w-[90px]'

	return (
		<div>
			<input
				className="toggle-input sr-only"
				type="checkbox"
				checked={on}
				onChange={noop}
				onClick={onClick}
			/>
			<div dir="ltr" data-orientation="horizontal">
				<div
					className="flex items-center group relative h-8 cursor-pointer gap-0 rounded-lg bg-gray-800 p-0.5 duration-200"
					style={{ outline: 'none' }}
				>
					<div className={on ? toggleBtnOn : toggleBtnOff}> </div>

					<button
						onClick={onClick}
						type="button"
						className="inline-flex items-center justify-center whitespace-nowrap px-3 text-sm font-medium text-gray-500 ring-offset-white hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-7 rounded-md transition-[colors,opacity] group-hover:text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white sm:data-[state=active]:bg-gray-800"
					>
						<div className="z-10 flex items-center">
							<svg
								className="h-3.5 w-3.5"
								fill="none"
								height="16"
								viewBox="0 0 16 16"
								width="16"
								xmlns="http://www.w3.org/2000/svg"
								color=""
							>
								<path
									clipRule="evenodd"
									d="M7.99995 0L2.99995 9.75H6.99995C7.55223 9.75 7.99995 10.1977 7.99995 10.75V16L12.9999 6.25H8.99995C8.44766 6.25 7.99995 5.80228 7.99995 5.25V0Z"
									fill="currentColor"
									fillRule="evenodd"
								></path>
							</svg>
							<div className="overflow-hidden text-left transition-[width] sm:block sm:w-[52px] w-0">
								<span className="ml-1">Speed</span>
							</div>
						</div>
					</button>

					<button
						onClick={onClick}
						type="button"
						className="inline-flex items-center justify-center whitespace-nowrap px-3 text-sm font-medium text-gray-500 ring-offset-white hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-7 rounded-md transition-[colors,opacity] group-hover:text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white sm:data-[state=active]:bg-gray-800"
					>
						<div className="z-10 flex items-center">
							<svg
								className="h-3.5 w-3.5"
								fill="none"
								height="16"
								viewBox="0 0 16 16"
								width="16"
								xmlns="http://www.w3.org/2000/svg"
								color="#00F7CB"
							>
								<g clipPath="url(#clip0_1578_1396)">
									<path
										d="M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z"
										fill="currentColor"
									></path>
									<path
										d="M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z"
										fill="currentColor"
									></path>
									<path
										d="M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z"
										fill="currentColor"
									></path>
								</g>
								<defs>
									<clipPath id="clip0_1578_1396">
										<rect fill="currentColor" height="16" width="16"></rect>
									</clipPath>
								</defs>
							</svg>
							<div className="overflow-hidden text-left transition-[width] sm:block sm:w-[52px] w-[52px]">
								<span className="ml-1">Quality</span>
							</div>
						</div>
					</button>
				</div>
			</div>
		</div>
	)
}

export { Switch }
