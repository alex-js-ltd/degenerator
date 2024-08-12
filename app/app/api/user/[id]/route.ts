import { NextResponse } from 'next/server'
import { prisma } from '@/app/utils/db'
import { invariantResponse } from '@/app/utils/misc'

export async function GET(
	_request: Request,
	{ params }: { params: { id: string } },
) {
	invariantResponse(params.id, 'Missing id', { status: 404 })

	const user = await prisma.user.findUnique({
		where: {
			publicKey: params.id,
		},

		include: {
			tokenMetadata: true,
		},
	})

	invariantResponse(user, 'Failed to retrieve user', { status: 500 })

	const { tokenMetadata } = user

	return NextResponse.json({ data: tokenMetadata })
}
