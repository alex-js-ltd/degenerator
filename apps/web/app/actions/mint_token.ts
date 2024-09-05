'use server'

import { parseWithZod } from '@conform-to/zod'
import { MintSchema } from '@/app/utils/schemas'
import { type PutBlobResult, put } from '@vercel/blob'
import { prisma } from '@/app/utils/db'
import { connection } from '@/app/utils/setup'
import { web3 } from '@coral-xyz/anchor'
import { program } from '@/app/utils/setup'
import { getMintInstructions, buildTransaction } from '@repo/degenerator'
import { isError, catchError } from '@/app/utils/misc'
import { Keypair, PublicKey } from '@solana/web3.js'

export async function mintToken(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: MintSchema,
	})

	const error = {
		...submission.reply(),
		serializedTransaction: undefined,
	}

	if (submission.status !== 'success') {
		return error
	}

	const { image, name, symbol, description, decimals, supply, payer } =
		submission.value

	const blob = await put(image.name, image, { access: 'public' }).catch(
		catchError,
	)

	if (isError(blob)) return { ...error, message: blob.message }

	const mint = web3.Keypair.generate()

	const upload = await uploadMetadata({
		...getMetadataParams({ payer, mint, name, symbol, blob, description }),
	}).catch(catchError)

	if (isError(upload)) return { ...error, message: upload.message }

	const metadata = {
		name,
		symbol,
		uri: `https://degenerator-tawny.vercel.app/api/metadata/${mint.publicKey.toBase58()}`,
	}

	const transaction = await buildTransaction({
		connection,
		payer,
		instructions: [
			...(await getMintInstructions({
				program,
				payer,
				mint: mint.publicKey,
				metadata,
				decimals,
				supply,
			})),
		],
		signers: [mint],
	}).catch(catchError)

	if (isError(transaction)) return { ...error, message: transaction.message }

	return {
		...submission.reply(),
		serializedTransaction: transaction.serialize(),
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

interface GetMetadataParams {
	payer: PublicKey
	mint: Keypair
	name: string
	symbol: string
	blob: PutBlobResult
	description: string
}

function getMetadataParams({
	payer,
	mint,
	name,
	symbol,
	blob,
	description,
}: GetMetadataParams) {
	return {
		publicKey: payer.toBase58(),
		mint: mint.publicKey.toBase58(),
		name,
		symbol,
		image: blob.url,
		description,
	}
}
