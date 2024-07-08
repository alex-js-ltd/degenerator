import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},

			colors: {
				success: {
					bg: 'hsl(150, 100%, 6%)',
					border: 'hsl(147, 100%, 12%)',
					text: 'hsl(150, 86%, 65%)',
				},
				info: {
					bg: 'hsl(215, 100%, 6%)',
					border: 'hsl(223, 100%, 12%)',
					text: 'hsl(216, 87%, 65%)',
				},
				warning: {
					bg: 'hsl(64, 100%, 6%)',
					border: 'hsl(60, 100%, 12%)',
					text: 'hsl(46, 87%, 65%)',
				},
				error: {
					bg: 'hsl(358, 76%, 10%)',
					border: 'hsl(357, 89%, 16%)',
					text: 'hsl(358, 100%, 81%)',
				},
			},

			keyframes: {
				slideDownAndFade: {
					from: { opacity: '0', transform: 'translateY(-2px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				slideLeftAndFade: {
					from: { opacity: '0', transform: 'translateX(2px)' },
					to: { opacity: '1', transform: 'translateX(0)' },
				},
				slideUpAndFade: {
					from: { opacity: '0', transform: 'translateY(4px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				slideRightAndFade: {
					from: { opacity: '0', transform: 'translateX(-2px)' },
					to: { opacity: '1', transform: 'translateX(0)' },
				},

				'scale-in-50': {
					from: { opacity: '0', transform: 'scale(0.5)' },
					to: { opacity: '1', transform: 'scale(1)' },
				},

				'scale-in-90': {
					from: { opacity: '0', transform: 'scale(0.90)' },
					to: { opacity: '1', transform: 'scale(1)' },
				},
			},
			animation: {
				slideDownAndFade:
					'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideLeftAndFade:
					'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideRightAndFade:
					'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',

				'scale-in-50': 'scale-in-50 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				'scale-in-90': 'scale-in-90 400ms cubic-bezier(0.16, 1, 0.3, 1)',
			},
		},
	},
	plugins: [],
}
export default config
