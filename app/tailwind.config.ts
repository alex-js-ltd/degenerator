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
		},
	},
	plugins: [],
}
export default config
