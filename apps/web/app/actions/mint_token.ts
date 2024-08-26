'use server'

import { parseWithZod } from '@conform-to/zod'
import { MintSchema } from '@/app/utils/schemas'
import { put } from '@vercel/blob'
import { prisma } from '@/app/utils/db'
import { connection } from '@/app/utils/setup'
import { web3 } from '@coral-xyz/anchor'
import { program } from '@/app/utils/setup'
import { getMintInstructions, buildTransaction } from '@repo/degenerator'
import { isError, catchError } from '@/app/utils/misc'

export async function mintToken(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: MintSchema,
	})

	const error = {
		...submission.reply(),
		serializedTransaction: undefined,
		mintA: undefined,
	}

	if (submission.status !== 'success') {
		return error
	}

	const { image, name, symbol, description, decimals, supply, payerKey, cpmm } =
		submission.value

	const blob = await put(image.name, image, { access: 'public' }).catch(
		catchError,
	)

	if (isError(blob)) return { ...error, message: blob.message }

	const publicKey = payerKey.toBase58()
	const mintKeypair = new web3.Keypair()
	const mintKey = mintKeypair.publicKey
	const mint = mintKey.toBase58()

	const upload = await uploadMetadata({
		publicKey,
		mint,
		name,
		symbol,
		image: blob.url,
		description,
	}).catch(catchError)

	if (isError(upload)) return { ...error, message: upload.message }

	const metadata = {
		name,
		symbol,
		uri: `https://degenerator-tawny.vercel.app/api/metadata/${upload.id}`,
	}

	const transaction = await buildTransaction({
		connection,
		payer: payerKey,
		instructions: [
			...(await getMintInstructions({
				program,
				payer: payerKey,
				mint: mintKey,
				metadata,
				decimals,
				supply,
				revoke: cpmm,
			})),
		],
		signers: [mintKeypair],
	}).catch(catchError)

	if (isError(transaction)) return { ...error, message: transaction.message }

	return {
		...submission.reply(),
		serializedTransaction: transaction.serialize(),
		mintA: mintKeypair.publicKey.toBase58(),
	}
}

interface UploadMetadataParams {
	publicKey: string
	mint: string
	name: string
	symbol: string
	image: string
	description: string
}

async function uploadMetadata({
	publicKey,
	mint,
	name,
	symbol,
	image,
	description,
}: UploadMetadataParams) {
	const existingUser = await prisma.user.findUnique({
		where: { publicKey },
	})

	// Create TokenMetadata with User
	const upload = await prisma.tokenMetadata.create({
		data: {
			mint,
			name,
			symbol,
			image,
			description,
			owner: existingUser
				? { connect: { publicKey: publicKey } }
				: { create: { publicKey: publicKey } },
		},
	})

	return upload
}
