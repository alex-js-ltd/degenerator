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
import {
	TOKEN_2022_PROGRAM_ID,
	getAssociatedTokenAddressSync,
	getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token'
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

export interface TestValues {
	id: PublicKey
	fee: number
	admin: Keypair
	mintAKeypair: Keypair
	mintBKeypair: Keypair
	defaultSupply: BN
	ammKey: PublicKey
	minimumLiquidity: BN
	poolKey: PublicKey
	poolAuthority: PublicKey
	mintLiquidity: PublicKey
	depositAmountA: BN
	depositAmountB: BN
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
		workspace.Degenerator.programId,
	)[0]

	// Making sure tokens are in the right order
	const mintAKeypair = Keypair.generate()
	let mintBKeypair = Keypair.generate()
	while (
		new BN(mintBKeypair.publicKey.toBytes()).lt(
			new BN(mintAKeypair.publicKey.toBytes()),
		)
	) {
		mintBKeypair = Keypair.generate()
	}

	const poolAuthority = PublicKey.findProgramAddressSync(
		[
			ammKey.toBuffer(),
			mintAKeypair.publicKey.toBuffer(),
			mintBKeypair.publicKey.toBuffer(),
			Buffer.from('authority'),
		],
		workspace.Degenerator.programId,
	)[0]
	const mintLiquidity = PublicKey.findProgramAddressSync(
		[
			ammKey.toBuffer(),
			mintAKeypair.publicKey.toBuffer(),
			mintBKeypair.publicKey.toBuffer(),
			Buffer.from('liquidity'),
		],
		workspace.Degenerator.programId,
	)[0]
	const poolKey = PublicKey.findProgramAddressSync(
		[
			ammKey.toBuffer(),
			mintAKeypair.publicKey.toBuffer(),
			mintBKeypair.publicKey.toBuffer(),
		],
		workspace.Degenerator.programId,
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

// export const mintingTokens = async ({
//     connection,
//     creator,
//     holder = creator,
//     mintAKeypair,
//     mintBKeypair,
//     mintedAmount = 100,
//     decimals = 6,
//   }: {
//     connection: Connection;
//     creator: Signer;
//     holder?: Signer;
//     mintAKeypair: Keypair;
//     mintBKeypair: Keypair;
//     mintedAmount?: number;
//     decimals?: number;
//   }) => {
//     // Mint tokens
//     await connection.confirmTransaction(await connection.requestAirdrop(creator.publicKey, 10 ** 10));
//     await createMint(connection, creator, creator.publicKey, creator.publicKey, decimals, mintAKeypair);
//     await createMint(connection, creator, creator.publicKey, creator.publicKey, decimals, mintBKeypair);
//     await getOrCreateAssociatedTokenAccount(connection, holder, mintAKeypair.publicKey, holder.publicKey, true);
//     await getOrCreateAssociatedTokenAccount(connection, holder, mintBKeypair.publicKey, holder.publicKey, true);
//     await mintTo(
//       connection,
//       creator,
//       mintAKeypair.publicKey,
//       getAssociatedTokenAddressSync(mintAKeypair.publicKey, holder.publicKey, true),
//       creator.publicKey,
//       mintedAmount * 10 ** decimals,
//     );
//     await mintTo(
//       connection,
//       creator,
//       mintBKeypair.publicKey,
//       getAssociatedTokenAddressSync(mintBKeypair.publicKey, holder.publicKey, true),
//       creator.publicKey,
//       mintedAmount * 10 ** decimals,
//     );
//   };
