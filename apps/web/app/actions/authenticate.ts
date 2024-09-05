'use server'

import { parseWithZod } from '@conform-to/zod'
import { AuthSchema } from '@/app/utils/schemas'
import { prisma } from '@/app/utils/db'
import { catchError, isError } from '@/app/utils/misc'

import { login, logout } from '@/app/utils/auth'

export async function authenticate(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: AuthSchema,
	})

	if (submission.status !== 'success') {
		return { ...submission.reply() }
	}

	const { publicKey } = submission.value

	if (!publicKey) {
		await logout()
		return { ...submission.reply() }
	}
	const pk = publicKey.toBase58()

	const user = await prisma.user
		.upsert({
			where: {
				publicKey: pk,
			},
			update: {}, // No updates needed if the user exists
			create: {
				publicKey: pk, // Create a new user with this publicKey
			},
		})
		.catch(catchError)

	if (isError(user)) return { message: user.message }

	await login(user.publicKey)

	return { ...submission.reply() }
}
