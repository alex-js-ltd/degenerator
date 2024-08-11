/** @type {import('next').NextConfig} */

import createMDX from '@next/mdx'

const nextConfig = {
	// Configure `pageExtensions` to include markdown and MDX files
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
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

			{
				protocol: 'https',
				hostname: 'rwssyl4cftw4nvaq.public.blob.vercel-storage.com',
				port: '',
				pathname: '/**',
			},
		],
	},
	transpilePackages: ['geist'],
}

const withMDX = createMDX({
	// Add markdown plugins here, as desired
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
