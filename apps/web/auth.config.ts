import type { NextAuthConfig } from 'next-auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

			return true
		},
	},
} satisfies NextAuthConfig
