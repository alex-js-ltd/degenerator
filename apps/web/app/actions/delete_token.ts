'use server'

import { parseWithZod } from '@conform-to/zod'
import { DeleteSchema } from '@/app/utils/schemas'
import { auth } from '@/auth'
import { prisma } from '@/app/utils/db'
import { catchError, isError } from '../utils/misc'

export async function deleteToken(
	_prevState: string | undefined,
	formData: FormData,
) {
	const submission = parseWithZod(formData, {
		schema: DeleteSchema,
	})

	const session = await auth()

	if (submission.status !== 'success') return 'invalid form'

	if (!session) return '🤡 unauthorised'

	const { mint } = submission.value

	const token = await prisma.tokenMetadata
		.deleteMany({
			where: {
				id: mint,
				ownerId: session.user?.id,
			},
		})
		.catch(catchError)

	if (isError(token)) return token.message

	return `deleted ${mint}`
}
