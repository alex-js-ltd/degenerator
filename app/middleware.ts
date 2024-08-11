import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	// Check if the pathname starts with '/', which is redundant since all paths start with '/'
	// Instead, check if it's the specific path you want to rewrite
	if (request.nextUrl.pathname === '/') {
		return NextResponse.rewrite(new URL('/home', request.url))
	}

	// Return a NextResponse object for other paths
	return NextResponse.next()
}
