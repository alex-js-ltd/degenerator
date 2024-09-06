import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { AuthSchema } from './app/utils/schemas'
import { getUser } from './app/data/get_user'

export const { auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			async authorize(credentials) {
				const parsedCredentials = AuthSchema.safeParse(credentials)

				if (parsedCredentials.success) {
					const { publicKey } = parsedCredentials.data

					const user = await getUser(publicKey)
					if (!user) return null
					console.log(user)
					return user
				}

				console.log('Invalid credentials')
				return null
			},
		}),
	],
})
