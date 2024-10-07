import * as anchor from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import {
	type Degenerator,
	airDrop,
	getInitializeDegeneratorIxs,
	buildTransaction,
	sendAndConfirm,
	getBondingCurveVault,
	getMintAuthority,
	getBuyTokenIxs,
	getSellTokenIxs,
	fetchBondingCurveState,
	isRentExempt,
	SOL,
	MEME,
} from '../index'
import {
	getAccount,
	TOKEN_2022_PROGRAM_ID,
	TOKEN_PROGRAM_ID,
	getAssociatedTokenAddress,
	NATIVE_MINT,
	getMint,
} from '@solana/spl-token'

const { BN } = anchor

describe('initialize', () => {
	const provider = anchor.AnchorProvider.env()
	anchor.setProvider(provider)

	const program = anchor.workspace.Degenerator as anchor.Program<Degenerator>

	const connection = provider.connection

	const payer = Keypair.generate()

	const mintAuthority = getMintAuthority({
		program,
		mint: MEME.mint,
	})

	const vault = getBondingCurveVault({
		program,
		mint: MEME.mint,
	})

	it('airdrop payer', async () => {
		await airDrop({
			connection,
			account: payer.publicKey,
		})
	})

	it('init bonding curve', async () => {
		const ixs = await getInitializeDegeneratorIxs({
			program,
			connection,
			payer: payer.publicKey,
			mint: MEME.mint,
			metadata: MEME.metadata,
			decimals: MEME.decimals,
		})

		const tx = await buildTransaction({
			connection: connection,
			payer: payer.publicKey,
			instructions: [...ixs],
			signers: [MEME.keypair],
		})

		tx.sign([payer])

		const res = await connection.simulateTransaction(tx)

		console.log(res)
		expect(res.value.err).toBeNull()

		await sendAndConfirm({ connection, tx })
	})

	it('check bonding curve mint authority is rent exempt', async () => {
		const rentExempt = await isRentExempt({
			connection: connection,
			address: mintAuthority,
		})
		expect(rentExempt).toBe(true)
	})

	it('check mint authority', async () => {
		const account = await getMint(
			connection,
			MEME.mint,
			'confirmed',
			TOKEN_2022_PROGRAM_ID,
		)

		expect(account.mintAuthority?.toBase58()).toBe(mintAuthority?.toBase58())
	})

	it('buy token', async () => {
		const amountToBuy = 1000

		const ix = await getBuyTokenIxs({
			program,
			payer: payer.publicKey,
			mint: MEME.mint,
			amount: amountToBuy,
		})

		const tx = await buildTransaction({
			connection: connection,
			payer: payer.publicKey,
			instructions: [ix],
			signers: [],
		})

		tx.sign([payer])

		// Simulate the transaction
		const res = await connection.simulateTransaction(tx)
		console.log(res)
		await sendAndConfirm({ connection, tx })
	})

	it('sell token', async () => {
		const amountToSell = 1000

		const ix = await getSellTokenIxs({
			program,
			payer: payer.publicKey,
			mint: MEME.mint,
			amount: amountToSell,
		})

		const tx = await buildTransaction({
			connection: connection,
			payer: payer.publicKey,
			instructions: [ix],
			signers: [],
		})

		tx.sign([payer])

		// Simulate the transaction
		const res = await connection.simulateTransaction(tx)
		console.log(res)
		await sendAndConfirm({ connection, tx })
	})
})
