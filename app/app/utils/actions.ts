'use server'

import { parseWithZod } from '@conform-to/zod'
import { TokenSchema } from './schemas'
import { put } from '@vercel/blob'
import { prisma } from '@/app/utils/db'
import invariant from 'tiny-invariant'
import { connection } from '@/app/utils/setup'
import { TransactionMessage, VersionedTransaction } from '@solana/web3.js'
import { web3 } from '@coral-xyz/anchor'
import { getInstructions } from '@/app/utils/instructions'

export async function createSplToken(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: TokenSchema,
	})

	if (submission.status !== 'success') {
		return {
			...submission.reply(),
			serializedTransaction: undefined,
		}
	}

	const {
		image,
		name,
		symbol,
		description,
		decimals,
		supply,
		payerKey,
		revokeMint,
		revokeFreeze,
	} = submission.value

	const blob = await put(image.name, image, { access: 'public' })

	invariant(blob, 'Failed to upload image')

	const upload = await prisma.tokenMetaData.create({
		data: {
			name,
			symbol,
			image: blob.url,
			description,
		},
	})

	invariant(upload, 'Failed to upload metadata')

	const metadata = {
		name,
		symbol,
		uri: `https://degenerator-tawny.vercel.app/api/metadata/${upload.id}`,
	}

	const mintKeypair = new web3.Keypair()

	const mintKey = mintKeypair.publicKey

	const instructions = await getInstructions({
		payerKey,
		mintKey,
		metadata,
		decimals,
		supply,
		revokeMint,
		revokeFreeze,
	})

	let blockhash = await connection
		.getLatestBlockhash()
		.then(res => res.blockhash)

	const messageV0 = new TransactionMessage({
		payerKey,
		recentBlockhash: blockhash,
		instructions,
	}).compileToV0Message()

	const transaction = new VersionedTransaction(messageV0)

	transaction.sign([mintKeypair])

	const serializedTransaction = transaction.serialize()

	return {
		...submission.reply(),
		serializedTransaction,
	}
}
