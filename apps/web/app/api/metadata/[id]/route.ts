import { NextResponse } from 'next/server'
import { prisma } from '@/app/utils/db'
import { invariantResponse } from '@/app/utils/misc'

export async function GET(
	_request: Request,
	{ params }: { params: { id: string } },
) {
	invariantResponse(params.id, 'Missing id', { status: 404 })

	const token = await prisma.tokenMetadata.findUnique({
		where: {
			id: params.id,
		},
	})

	invariantResponse(token, 'Failed to retrieve token metadata', { status: 500 })

	const { id, mint, createdAt, updatedAt, ownerId, ...meta } = token

	return NextResponse.json({ ...meta })
}