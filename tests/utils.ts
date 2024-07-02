import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Degenerator } from '../target/types/degenerator'
import {
	getAssociatedTokenAddressSync,
	TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import { Keypair, PublicKey } from '@solana/web3.js'
import { BN } from 'bn.js'
import invariant from 'tiny-invariant'

export interface TestValues {
	id: PublicKey
	fee: number
	admin: Keypair
	mintAKeypair: Keypair
	mintBKeypair: Keypair
	defaultSupply: anchor.BN
	ammKey: PublicKey
	minimumLiquidity: anchor.BN
	poolKey: PublicKey
	poolAuthority: PublicKey
	mintLiquidity: PublicKey
	depositAmountA: anchor.BN
	depositAmountB: anchor.BN
	liquidityAccount: PublicKey
	poolAccountA: PublicKey
	poolAccountB: PublicKey
	holderAccountA: PublicKey
	holderAccountB: PublicKey
}

type TestValuesDefaults = {
	[K in keyof TestValues]+?: TestValues[K]
}
export function createValues(defaults?: TestValuesDefaults): TestValues {
	const id = defaults?.id || Keypair.generate().publicKey
	const admin = Keypair.generate()
	const ammKey = PublicKey.findProgramAddressSync(
		[id.toBuffer()],
		anchor.workspace.Degenerator.programId,
	)[0]

	const { mintAKeypair, mintBKeypair } = defaults
	// Making sure tokens are in the right order
	// const mintAKeypair = Keypair.generate()
	// let mintBKeypair = Keypair.generate()
	// while (
	// 	new BN(mintBKeypair.publicKey.toBytes()).lt(
	// 		new BN(mintAKeypair.publicKey.toBytes()),
	// 	)
	// ) {
	// 	mintBKeypair = Keypair.generate()
	// }

	const poolAuthority = PublicKey.findProgramAddressSync(
		[
			ammKey.toBuffer(),
			mintAKeypair.publicKey.toBuffer(),
			mintBKeypair.publicKey.toBuffer(),
			Buffer.from('authority'),
		],
		anchor.workspace.Degenerator.programId,
	)[0]
	const mintLiquidity = PublicKey.findProgramAddressSync(
		[
			ammKey.toBuffer(),
			mintAKeypair.publicKey.toBuffer(),
			mintBKeypair.publicKey.toBuffer(),
			Buffer.from('liquidity'),
		],
		anchor.workspace.Degenerator.programId,
	)[0]
	const poolKey = PublicKey.findProgramAddressSync(
		[
			ammKey.toBuffer(),
			mintAKeypair.publicKey.toBuffer(),
			mintBKeypair.publicKey.toBuffer(),
		],
		anchor.workspace.Degenerator.programId,
	)[0]
	return {
		id,
		fee: 500,
		admin,
		ammKey,
		mintAKeypair,
		mintBKeypair,
		mintLiquidity,
		poolKey,
		poolAuthority,
		poolAccountA: getAssociatedTokenAddressSync(
			mintAKeypair.publicKey,
			poolAuthority,
			true,
		),
		poolAccountB: getAssociatedTokenAddressSync(
			mintBKeypair.publicKey,
			poolAuthority,
			true,
		),
		liquidityAccount: getAssociatedTokenAddressSync(
			mintLiquidity,
			admin.publicKey,
			true,
		),
		holderAccountA: getAssociatedTokenAddressSync(
			mintAKeypair.publicKey,
			admin.publicKey,
			true,
		),
		holderAccountB: getAssociatedTokenAddressSync(
			mintBKeypair.publicKey,
			admin.publicKey,
			true,
		),
		depositAmountA: new BN(4 * 10 ** 6),
		depositAmountB: new BN(1 * 10 ** 6),
		minimumLiquidity: new BN(100),
		defaultSupply: new BN(100 * 10 ** 6),
	}
}

type MintTokenParams = {
	program: Program<Degenerator>
	payerKeypair: Keypair
	mintKeypair: Keypair
	metadata: { name: string; symbol: string; uri: string }
	decimals: number
	supply: number
}

export async function mintToken({
	program,
	payerKeypair,
	mintKeypair,
	metadata,
	decimals,
	supply,
}: MintTokenParams) {
	const ATA_PROGRAM_ID = new anchor.web3.PublicKey(
		'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
	)

	const [receiverATA] = anchor.web3.PublicKey.findProgramAddressSync(
		[
			payerKeypair.publicKey.toBytes(),
			TOKEN_2022_PROGRAM_ID.toBytes(),
			mintKeypair.publicKey.toBytes(),
		],
		ATA_PROGRAM_ID,
	)

	// Create Mint with MetadataPointer and TokenMetadata Extensions
	const init = await program.methods
		.initialize(metadata, decimals)
		.accounts({ mintAccount: mintKeypair.publicKey })
		.signers([mintKeypair])
		.rpc({ skipPreflight: true })

	invariant(init, 'Failed to create mint')

	// Create Associated Token Account
	const createAta = await program.methods
		.createAssociatedTokenAccount()
		.accounts({
			tokenAccount: receiverATA,
			mint: mintKeypair.publicKey,
			signer: payerKeypair.publicKey,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.signers([payerKeypair])
		.rpc({ skipPreflight: true })

	invariant(createAta, 'Failed to create associated token account')

	// Mint token to payer
	const mintToken = await program.methods
		.mintToken(new anchor.BN(supply))
		.accounts({
			mint: mintKeypair.publicKey,
			signer: payerKeypair.publicKey,
			receiver: receiverATA,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.signers([payerKeypair])
		.rpc({ skipPreflight: true })

	invariant(mintToken, 'Failed to mint token')

	// Revoke freeze authority
	const revokeFreeze = await program.methods
		.revokeFreezeAuthority()
		.accounts({
			currentAuthority: payerKeypair.publicKey,
			mintAccount: mintKeypair.publicKey,
		})
		.rpc()

	invariant(revokeFreeze, 'Failed to revoke freeze authority')

	// Revoke mint authority
	const revokeMint = await program.methods
		.revokeMintAuthority()
		.accounts({
			currentAuthority: payerKeypair.publicKey,
			mintAccount: mintKeypair.publicKey,
		})
		.rpc()

	invariant(revokeMint, 'Failed to revoke mint authority')
}
