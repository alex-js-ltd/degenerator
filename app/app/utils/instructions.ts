import { program } from '@/app/utils/setup'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { web3, BN } from '@coral-xyz/anchor'
import invariant from 'tiny-invariant'

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
