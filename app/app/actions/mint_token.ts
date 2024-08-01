'use server'

import { parseWithZod } from '@conform-to/zod'
import { TokenSchema } from '@/app/utils/schemas'
import { put } from '@vercel/blob'
import { prisma } from '@/app/utils/db'
import { connection } from '@/app/utils/setup'
import { web3, BN } from '@coral-xyz/anchor'
import { program } from '@/app/utils/setup'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { buildTransaction } from '@/app/utils/transaction'
import { isError } from '@/app/utils/misc'

export async function mintToken(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: TokenSchema,
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
		err => ({ message: 'failed to create blob' }),
	)

	if (isError(blob)) return { ...error, message: blob.message }

	const upload = await prisma.tokenMetaData
		.create({
			data: {
				name,
				symbol,
				image: blob.url,
				description,
			},
		})
		.catch(err => ({ message: 'failed to upload image' }))

	if (isError(upload)) return { ...error, message: upload.message }

	const metadata = {
		name,
		symbol,
		uri: `https://degenerator-tawny.vercel.app/api/metadata/${upload.id}`,
	}

	const mintKeypair = new web3.Keypair()

	const mintKey = mintKeypair.publicKey

	const instructions = await getMintInstructions({
		payerKey,
		mintKey,
		metadata,
		decimals,
		supply,
		revokeMint: cpmm,
		revokeFreeze: cpmm,
	}).catch(err => ({ message: 'failed to get mint instructions' }))

	if (isError(instructions)) return { ...error, message: instructions.message }

	const transaction = await buildTransaction({
		connection,
		payer: payerKey,
		instructions,
		signers: [mintKeypair],
	}).catch(err => ({ message: 'failed to get mint instructions' }))

	if (isError(transaction)) return { ...error, message: transaction.message }

	return {
		...submission.reply(),
		serializedTransaction: transaction.serialize(),
		mintA: mintKeypair.publicKey.toBase58(),
	}
}

type GetMintInstructionsParams = {
	payerKey: PublicKey
	mintKey: PublicKey
	metadata: { name: string; symbol: string; uri: string }
	decimals: number
	supply: number
	revokeMint?: boolean
	revokeFreeze?: boolean
}

async function getMintInstructions({
	payerKey,
	mintKey,
	metadata,
	decimals,
	supply,
	revokeMint,
	revokeFreeze,
}: GetMintInstructionsParams) {
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

	return instructions.reduce<web3.TransactionInstruction[]>((acc, curr) => {
		if (curr) acc.push(curr)
		return acc
	}, [])
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

	return res
}
