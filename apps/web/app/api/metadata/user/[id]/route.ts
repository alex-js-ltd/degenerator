import { NextResponse } from 'next/server'
import { prisma } from '@/app/utils/db'
import { invariantResponse } from '@/app/utils/misc'

export async function POST(
	_request: Request,
	{ params }: { params: { id: string } },
) {
	invariantResponse(params.id, 'Missing id', { status: 404 })

	const user = await prisma.user.upsert({
		where: {
			publicKey: params.id,
		},
		update: {},
		create: {
			publicKey: params.id,
		},
	})

	const { publicKey } = user

	return NextResponse.json({ message: `new user created ${publicKey}` })
}
