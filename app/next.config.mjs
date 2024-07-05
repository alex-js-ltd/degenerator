/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		instrumentationHook: true,
	},

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'img-v1.raydium.io',
				port: '',
				pathname: '/icon/**',
			},
		],
	},
}

export default nextConfig
