'use server'

import { parseWithZod } from '@conform-to/zod'
import { TokenSchema } from './schemas'
import { put } from '@vercel/blob'
import { prisma } from '@/app/utils/db'
import invariant from 'tiny-invariant'
import { program, connection } from '@/app/utils/setup'
import {
	TransactionMessage,
	PublicKey,
	VersionedTransaction,
} from '@solana/web3.js'
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import * as anchor from '@coral-xyz/anchor'

export async function createSplToken(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: TokenSchema,
	})

	if (submission.status !== 'success') {
		return { ...submission.reply(), serializedTransaction: undefined }
	}

	const { image, name, symbol, description, decimals, supply, payer } =
		submission.value

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

	const mintKeypair = new anchor.web3.Keypair()

	const payerKey = new PublicKey(payer)

	const ATA_PROGRAM_ID = new anchor.web3.PublicKey(
		'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
	)

	const [receiverATA] = anchor.web3.PublicKey.findProgramAddressSync(
		[
			payerKey.toBytes(),
			TOKEN_2022_PROGRAM_ID.toBytes(),
			mintKeypair.publicKey.toBytes(),
		],
		ATA_PROGRAM_ID,
	)

	const [payerATA] = anchor.web3.PublicKey.findProgramAddressSync(
		[
			payerKey.toBytes(),
			TOKEN_2022_PROGRAM_ID.toBytes(),
			mintKeypair.publicKey.toBytes(),
		],
		ATA_PROGRAM_ID,
	)

	// Create Mint with MetadataPointer and TokenMetadata Extensions
	const initialize = await program.methods
		.initialize(metadata, decimals)
		.accounts({ mintAccount: mintKeypair.publicKey, payer: payerKey })
		.instruction()

	invariant(initialize, 'Failed to create mint')

	// Create Associated Token Account
	const createAssociatedTokenAccount = await program.methods
		.createAssociatedTokenAccount()
		.accounts({
			tokenAccount: receiverATA,
			mint: mintKeypair.publicKey,
			signer: payerKey,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	invariant(
		createAssociatedTokenAccount,
		'Failed to create associated token account',
	)

	// Mint Token to Payer
	const mintToken = await program.methods
		.mintToken(new anchor.BN(supply))
		.accounts({
			mint: mintKeypair.publicKey,
			signer: payerKey,
			receiver: payerATA,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	invariant(mintToken, 'Failed to mint token')

	// Close Mint
	const closeMint = await program.methods
		.closeMint()
		.accounts({
			currentAuthority: payerKey,
			mintAccount: mintKeypair.publicKey,
		})
		.instruction()

	invariant(closeMint, 'Failed to revoke mint authority')

	// Revoke Freeze Authority
	const revokeFreezeAuthority = await program.methods
		.revokeFreezeAuthority()
		.accounts({
			currentAuthority: payerKey,
			mintAccount: mintKeypair.publicKey,
		})
		.instruction()

	invariant(revokeFreezeAuthority, 'Failed to revoke freeze authority')

	let blockhash = await connection
		.getLatestBlockhash()
		.then(res => res.blockhash)

	const instructions = [
		initialize,
		createAssociatedTokenAccount,
		mintToken,
		revokeFreezeAuthority,
		closeMint,
	]

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
