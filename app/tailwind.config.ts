import { type Config } from 'tailwindcss'
/** @type {import('tailwindcss').Config} */

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-geist-sans)'],
				mono: ['var(--font-geist-mono)'],
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'gradient-pink': 'linear-gradient(45deg, #06b0f9, #f906b0)',
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
				'slide-up-and-fade': {
					from: { opacity: '0', transform: 'translateY(4px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},

				'slide-down-and-fade': {
					from: { opacity: '1', transform: 'translateY(0px)' },
					to: { opacity: '0', transform: 'translateY(4px)' },
				},

				'scale-in-50': {
					from: { opacity: '0', transform: 'scale(0.5)' },
					to: { opacity: '1', transform: 'scale(1)' },
				},

				'scale-out-50': {
					from: { opacity: '1', transform: 'scale(1)' },
					to: { opacity: '0', transform: 'scale(0.5)' },
				},

				'scale-in-95': {
					from: { opacity: '0', transform: 'scale(0.95)' },
					to: { opacity: '1', transform: 'scale(1)' },
				},

				'scale-out-95': {
					from: { opacity: '1', transform: 'scale(1)' },
					to: { opacity: '0', transform: 'scale(0.95)' },
				},
			},
			animation: {
				'slide-up-and-fade':
					'slide-up-and-fade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-down-and-fade':
					'slide-down-and-fade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				'scale-in-50': 'scale-in-50 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				'scale-out-50': 'scale-out-50 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				'scale-in-95': 'scale-in-95 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				'scale-out-95': 'scale-out-95 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				'spin-fast': 'spin 400ms linear infinite',
				'pulse-fast': 'pulse 400ms cubic-bezier(0.16, 1, 0.3, 1)',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
}
export default config
