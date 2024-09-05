import { type NextRequest, NextResponse } from 'next/server'

import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export function middleware(request: NextRequest) {
	// Check if the pathname starts with '/', which is redundant since all paths start with '/'
	// Instead, check if it's the specific path you want to rewrite
	if (request.nextUrl.pathname === '/') {
		return NextResponse.rewrite(new URL('/home', request.url))
	}

	// Return a NextResponse object for other paths
	return NextResponse.next()
}

export default NextAuth(authConfig).auth

export const config = {
	// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
