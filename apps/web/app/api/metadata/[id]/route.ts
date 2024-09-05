import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/utils/db'
import { invariantResponse } from '@/app/utils/misc'
import { getSession } from '@/app/utils/auth'

export async function GET(
	_request: NextRequest,
	{ params }: { params: { id: string } },
) {
	invariantResponse(params.id, 'missing id', { status: 404 })

	const token = await prisma.tokenMetadata.findUnique({
		where: {
			mint: params.id,
		},
	})

	invariantResponse(token, 'failed to retrieve token metadata', { status: 500 })

	const { id, mint, createdAt, updatedAt, ownerId, ...meta } = token

	return NextResponse.json({ ...meta })
}

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: { id: string } },
) {
	// Validate the presence of the token ID (mint value)
	invariantResponse(params.id, 'missing id', { status: 404 })

	const session = await getSession()

	invariantResponse(session.publicKey, 'not authorised', { status: 403 })

	const token = await prisma.tokenMetadata.findFirst({
		where: {
			mint: params.id,
			ownerId: session.publicKey,
		},
	})

	invariantResponse(token, 'token not found or unauthorized', { status: 403 })

	await prisma.tokenMetadata.delete({
		where: {
			id: token.id, // Use the token's id for deletion
		},
	})

	// Return a success response
	return NextResponse.json({ message: 'token deleted successfully' })
}
