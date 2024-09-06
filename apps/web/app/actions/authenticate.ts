'use server'

import * as auth from '@/auth'
import { AuthError } from 'next-auth'

export async function signIn(formData: FormData) {
	console.log(formData)
	try {
		await auth.signIn('credentials', formData)
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return 'Invalid credentials.'
				default:
					return 'Something went wrong.'
			}
		}
		throw error
	}
}

export async function signOut(formData: FormData) {
	try {
		await auth.signOut()
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return 'Invalid credentials.'
				default:
					return 'Something went wrong.'
			}
		}
		throw error
	}
}
