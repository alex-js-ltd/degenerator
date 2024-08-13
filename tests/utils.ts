import {
	Program,
	web3,
	AnchorProvider,
	setProvider,
	BN,
	workspace,
	type Wallet,
} from '@coral-xyz/anchor'
import { Degenerator } from '../target/types/degenerator'
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { Keypair, PublicKey } from '@solana/web3.js'

const program = workspace.Degenerator as Program<Degenerator>

export function setUp() {
	const provider = AnchorProvider.env()
	setProvider(provider)
	const wallet = provider.wallet as Wallet
	return { program, provider, wallet }
}

interface MintTokenParams {
	wallet: Wallet
	mintKeypair: Keypair
	metadata: { name: string; symbol: string; uri: string }
	decimals: number
	supply: number
}

export async function mintToken({
	wallet,
	mintKeypair,
	metadata,
	decimals,
	supply,
}: MintTokenParams) {
	const ATA_PROGRAM_ID = new PublicKey(
		'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
	)

	const initialize = await program.methods
		.initialize(decimals, metadata)
		.accounts({ mintAccount: mintKeypair.publicKey })
		.signers([mintKeypair])
		.rpc({ skipPreflight: true })
	console.log('Your transaction signature', initialize)

	const [receiverATA] = web3.PublicKey.findProgramAddressSync(
		[
			wallet.publicKey.toBytes(),
			TOKEN_2022_PROGRAM_ID.toBytes(),
			mintKeypair.publicKey.toBytes(),
		],
		ATA_PROGRAM_ID,
	)

	const ata = await program.methods
		.createAssociatedTokenAccount()
		.accounts({
			tokenAccount: receiverATA,
			mint: mintKeypair.publicKey,
			signer: wallet.publicKey,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.signers([wallet.payer])
		.rpc({ skipPreflight: true })
	console.log('Your transaction signature', ata)

	const [payerATA] = web3.PublicKey.findProgramAddressSync(
		[
			wallet.publicKey.toBytes(),
			TOKEN_2022_PROGRAM_ID.toBytes(),
			mintKeypair.publicKey.toBytes(),
		],
		ATA_PROGRAM_ID,
	)

	const mint = await program.methods
		.mintToken(new BN(supply))
		.accounts({
			mint: mintKeypair.publicKey,
			signer: wallet.publicKey,
			receiver: payerATA,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.signers([wallet.payer])
		.rpc({ skipPreflight: true })
	console.log('Your transaction signature', mint)

	const revokeFreeze = await program.methods
		.revokeFreezeAuthority()
		.accounts({
			currentAuthority: wallet.publicKey,
			mintAccount: mintKeypair.publicKey,
		})
		.rpc()

	console.log('Your transaction signature', revokeFreeze)

	const revokeMint = await program.methods
		.revokeMintAuthority()
		.accounts({
			currentAuthority: wallet.publicKey,
			mintAccount: mintKeypair.publicKey,
		})
		.rpc()

	console.log('Your transaction signature', revokeMint)
}
