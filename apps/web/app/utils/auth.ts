import { SessionOptions } from 'iron-session'

import { getIronSession, IronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { delay } from '@/app/utils/misc'

export interface SessionData {
	publicKey: string
	isLoggedIn: boolean
}

export const defaultSession: SessionData = {
	publicKey: '',
	isLoggedIn: false,
}

export const sessionOptions: SessionOptions = {
	password: 'complex_password_at_least_32_characters_long',
	cookieName: 'iron-examples-app-router-server-component-and-action',
	cookieOptions: {
		// secure only works in `https` environments
		// if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
		secure: true,
	},
}

export async function getSession() {
	const session = await getIronSession<SessionData>(cookies(), sessionOptions)

	if (!session.isLoggedIn) {
		session.isLoggedIn = defaultSession.isLoggedIn
		session.publicKey = defaultSession.publicKey
	}

	console.log('session', session)
	return session
}

export async function logout() {
	'use server'

	// false => no db call for logout
	const session = await getSession()
	session.destroy()
	revalidatePath('/')
}

export async function login(publicKey: string) {
	'use server'

	const session = await getSession()

	session.publicKey = publicKey
	session.isLoggedIn = true
	await session.save()
	revalidatePath('/')
}
