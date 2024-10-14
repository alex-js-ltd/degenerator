'use server'

import { SubmissionResult } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { MintSchema } from '@/app/utils/schemas'
import { type PutBlobResult, put } from '@vercel/blob'
import { prisma } from '@/app/utils/db'
import { web3 } from '@coral-xyz/anchor'
import { program, connection } from '@/app/utils/setup'
import {
	getInitializeDegeneratorIxs,
	buildTransaction,
} from '@repo/degenerator'
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
	lastResult?: SubmissionResult<string[]>
	data?: {
		serializedTransaction: Uint8Array
		mint: string
	}
}

export async function initializeAction(_prevState: State, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: MintSchema,
	})

	if (submission.status !== 'success') {
		return {
			lastResult: submission.reply(),
		}
	}

	const { image, name, symbol, description, decimals, payer } = submission.value

	const blob = await put(image.name, image, { access: 'public' })

	const mint = web3.Keypair.generate()

	const upload = await uploadMetadata({
		...getMetadataParams({ payer, mint, name, symbol, blob, description }),
	})

	const metadata = {
		name,
		symbol,
		uri: `https://degenerator-tawny.vercel.app/api/metadata/${upload.id}`,
		mint: mint.publicKey,
	}

	const ixs = await getInitializeDegeneratorIxs({
		program,
		payer: payer,
		metadata: metadata,
		decimals: decimals,
		uiAmount: '1.0',
	})

	const transaction = await buildTransaction({
		connection,
		payer,
		instructions: [...ixs],
		signers: [mint],
	})

	return {
		lastResult: submission.reply(),
		data: {
			serializedTransaction: transaction.serialize(),
			mint: mint.publicKey.toBase58(),
		},
	}
}
