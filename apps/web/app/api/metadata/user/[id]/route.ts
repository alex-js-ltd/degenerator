import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/utils/db'
import { invariantResponse } from '@/app/utils/misc'

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: { id: string } },
) {
	invariantResponse(params.id, 'missing id', { status: 404 })

	const token = await prisma.user.findUnique({
		where: {
			id: params.id,
		},
	})

	invariantResponse(token, 'failed to retrieve token metadata', { status: 500 })

	return NextResponse.json({})
}
