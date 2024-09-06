import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
	pages: {
		signIn: '/',
	},
	providers: [
		// added later in auth.ts since it requires bcrypt which is only compatible with Node.js
		// while this file is also used in non-Node.js environments
	],
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user
			return isLoggedIn
		},

		jwt: async ({ token, user }) => {
			user && (token.user = user)
			return token
		},
		session: async ({ session, token }) => {
			return { ...session, ...token }
		},
	},
} satisfies NextAuthConfig
