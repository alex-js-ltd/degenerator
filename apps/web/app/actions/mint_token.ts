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

	if (submission.status !== 'success') {
		return {
			...submission.reply(),
			serializedTransaction: undefined,
			mint: undefined,
		}
	}

	const { image, name, symbol, description, decimals, supply, payer } =
		submission.value

	const blob = await put(image.name, image, { access: 'public' }).catch(
		catchError,
	)

	if (isError(blob))
		return {
			...submission.reply(),
			serializedTransaction: undefined,
			mint: undefined,
		}

	const mint = web3.Keypair.generate()

	const upload = await uploadMetadata({
		...getMetadataParams({ payer, mint, name, symbol, blob, description }),
	}).catch(catchError)

	if (isError(upload))
		return {
			...submission.reply(),
			serializedTransaction: undefined,
			mint: undefined,
		}

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

	if (isError(transaction))
		return {
			...submission.reply(),
			serializedTransaction: undefined,
			mint: undefined,
		}

	return {
		...submission.reply(),
		serializedTransaction: transaction.serialize(),
		mint: mint.publicKey.toBase58(),
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
	// Create TokenMetadata with User
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
