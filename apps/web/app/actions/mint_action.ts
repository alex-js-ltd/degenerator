'use server'

import { SubmissionResult } from '@conform-to/react'
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
	const upload = await prisma.tokenMetadata.create({
		data: {
			id: mint,
			name,
			symbol,
			image,
			description,
			owner: { connect: { id: publicKey } },
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

export type State = {
	submission?: SubmissionResult<string[]>
	data?: {
		serializedTransaction: Uint8Array
		mint: string
	}
}

export async function mintAction(_prevState: State, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: MintSchema,
	})

	if (submission.status !== 'success') {
		return {
			submission: submission.reply(),
		}
	}

	const { image, name, symbol, description, decimals, supply, payer } =
		submission.value

	const blob = await put(image.name, image, { access: 'public' })

	const mint = web3.Keypair.generate()

	const upload = await uploadMetadata({
		...getMetadataParams({ payer, mint, name, symbol, blob, description }),
	})

	const metadata = {
		name,
		symbol,
		uri: `https://degenerator-tawny.vercel.app/api/metadata/${upload.id}`,
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
	})

	return {
		submission: submission.reply(),
		data: {
			serializedTransaction: transaction.serialize(),
			mint: mint.publicKey.toBase58(),
		},
	}
}
