'use server'

import { parseWithZod } from '@conform-to/zod'
import { TokenSchema } from '@/app/utils/schemas'
import { put } from '@vercel/blob'
import { prisma } from '@/app/utils/db'
import invariant from 'tiny-invariant'
import { connection } from '@/app/utils/setup'
import { TransactionMessage, VersionedTransaction } from '@solana/web3.js'
import { web3, BN } from '@coral-xyz/anchor'
import { program } from '@/app/utils/setup'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'

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
		quoteToken,
		feeTier,
	} = submission.value

	console.log(submission)
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

type GetInstructionsParams = {
	payerKey: PublicKey
	mintKey: PublicKey
	metadata: { name: string; symbol: string; uri: string }
	decimals: number
	supply: number
	revokeMint?: boolean
	revokeFreeze?: boolean
}

export async function getInstructions({
	payerKey,
	mintKey,
	metadata,
	decimals,
	supply,
	revokeMint,
	revokeFreeze,
}: GetInstructionsParams) {
	const ATA_PROGRAM_ID = new web3.PublicKey(
		'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
	)

	const [receiverATA] = web3.PublicKey.findProgramAddressSync(
		[payerKey.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mintKey.toBytes()],
		ATA_PROGRAM_ID,
	)

	// Create Mint with MetadataPointer and TokenMetadata Extensions
	const initialize = await program.methods
		.initialize(metadata, decimals)
		.accounts({ mintAccount: mintKey, payer: payerKey })
		.instruction()

	invariant(initialize, 'Failed to create mint')

	// Create Associated Token Account
	const createAta = await program.methods
		.createAssociatedTokenAccount()
		.accounts({
			tokenAccount: receiverATA,
			mint: mintKey,
			signer: payerKey,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	invariant(createAta, 'Failed to create associated token account')

	// Mint Token to Payer
	const mintToken = await program.methods
		.mintToken(new BN(supply))
		.accounts({
			mint: mintKey,
			signer: payerKey,
			receiver: receiverATA,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	invariant(mintToken, 'Failed to mint token')

	// additional instructions
	const revokeMintAuth =
		revokeMint && (await getRevokeMintAuth(payerKey, mintKey))
	const revokeFreezeAuth =
		revokeFreeze && (await getFreezeAuth(payerKey, mintKey))

	const instructions = [
		initialize,
		createAta,
		mintToken,
		revokeMintAuth,
		revokeFreezeAuth,
	]

	const initial: web3.TransactionInstruction[] = []

	return instructions.reduce((acc, curr) => {
		if (curr) acc.push(curr)
		return acc
	}, initial)
}

async function getRevokeMintAuth(
	currentAuthority: PublicKey,
	mintAccount: PublicKey,
) {
	const res = await program.methods
		.revokeMintAuthority()
		.accounts({
			currentAuthority,
			mintAccount,
		})
		.instruction()

	invariant(res, 'Failed to revoke mint authority')

	return res
}

async function getFreezeAuth(
	currentAuthority: PublicKey,
	mintAccount: PublicKey,
) {
	const res = await program.methods
		.revokeFreezeAuthority()
		.accounts({
			currentAuthority,
			mintAccount,
		})
		.instruction()

	invariant(res, 'Failed to revoke freeze authority')

	return res
}
