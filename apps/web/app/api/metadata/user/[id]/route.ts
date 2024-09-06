import { NextResponse } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/app/utils/db'
import { invariantResponse } from '@/app/utils/misc'
import { auth } from '@/auth'

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
	const session = await auth(req, res) // assuming auth handles request object and provides session

	invariantResponse(session, 'unauthorized 🤡', { status: 500 })

	const { id: mint } = req.query

	invariantResponse(typeof mint === 'string', 'invalid mint query', {
		status: 500,
	})

	const token = await prisma.tokenMetadata.delete({
		where: {
			mint: mint,
		},
	})

	return NextResponse.json({ message: `token ${token.mint} deleted` })
}
