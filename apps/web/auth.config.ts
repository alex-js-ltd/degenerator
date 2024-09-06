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
			console.log('authorized', auth?.user)
			return true
		},

		async jwt({ user, token, session, trigger }) {
			if (trigger === 'update') {
				return {
					...token,
					...session.user,
				}
			}
			return { ...token, ...user }
		},

		async session({ session, token }) {
			console.log('seesion callback', session)
			return session
		},
	},
} satisfies NextAuthConfig
