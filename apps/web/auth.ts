import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { AuthSchema } from '@/app/utils/schemas'
import { prisma } from '@/app/utils/db'

async function getUser(publicKey: string) {
	const user = await prisma.user.upsert({
		where: {
			publicKey, // Lookup by unique `publicKey`
		},
		update: {}, // No update needed if the user exists
		create: {
			publicKey, // Create a new user with this publicKey
			// Add any additional fields required for user creation
		},
	})

	return user
}

export const { auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			async authorize(credentials) {
				const parsedCredentials = AuthSchema.safeParse(credentials)

				if (parsedCredentials.success) {
					const { publicKey } = parsedCredentials.data

					const user = await getUser(publicKey.toBase58())
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
