'use server'

import { auth } from '@/auth'
import { prisma } from '@/app/utils/db'
import { catchError, isError } from '@/app/utils/misc'
import { revalidatePath } from 'next/cache'

export async function deleteAction(mint: string) {
	const session = await auth()

	if (!session?.user) return '🤡 unauthorised'

	const token = await prisma.tokenMetadata
		.delete({
			where: {
				id: mint,
				ownerId: session.user?.id,
			},
		})
		.catch(catchError)

	if (isError(token)) return token.message

	revalidatePath('/')
	return `${token.id} deleted`
}
