import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/utils/db'
import { invariantResponse } from '@/app/utils/misc'
import { auth } from '@/auth'

export async function GET(
	_request: NextRequest,
	{ params }: { params: { id: string } },
) {
	invariantResponse(params.id, 'missing id', { status: 404 })

	const token = await prisma.tokenMetadata.findUnique({
		where: {
			id: params.id,
		},
	})

	invariantResponse(token, 'failed to retrieve token metadata', { status: 500 })

	const { id, createdAt, updatedAt, ownerId, ...meta } = token

	return NextResponse.json({ ...meta })
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	invariantResponse(params.id, 'missing id', { status: 404 })

	console.log(request)
	const session = await auth()

	invariantResponse(session, 'unauthorised', { status: 403 })

	const token = await prisma.tokenMetadata.delete({
		where: {
			id: params.id,
			ownerId: session?.user?.id,
		},
	})

	invariantResponse(token, 'failed to retrieve token metadata', { status: 500 })

	const { id, createdAt, updatedAt, ownerId, ...meta } = token

	return NextResponse.json({ ...meta })
}
