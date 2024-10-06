import * as anchor from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import {
	type Degenerator,
	airDrop,
	getInitializeDegeneratorIxs,
	buildTransaction,
	sendAndConfirm,
	getBondingCurveVault,
	getBondingCurveHodl,
	getAssociatedAddress,
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
} from '@solana/spl-token'

const { BN } = anchor

describe('initialize', () => {
	const provider = anchor.AnchorProvider.env()
	anchor.setProvider(provider)

	const program = anchor.workspace.Degenerator as anchor.Program<Degenerator>

	const connection = provider.connection

	const payer = Keypair.generate()

	const vault = getBondingCurveVault({
		program,
		token1Mint: MEME.mint,
	})

	const hodl = getBondingCurveHodl({
		program,
		token1Mint: MEME.mint,
	})

	const supply = 100

	it('airdrop payer', async () => {
		await airDrop({
			connection,
			account: payer.publicKey,
		})
	})

	it('mint token to payer & init pool', async () => {
		const ixs = await getInitializeDegeneratorIxs({
			program,
			connection,
			payer: payer.publicKey,
			mint: MEME.mint,
			metadata: MEME.metadata,
			decimals: MEME.decimals,
			supply: supply,
		})

		const tx = await buildTransaction({
			connection: connection,
			payer: payer.publicKey,
			instructions: [...ixs],
			signers: [MEME.keypair],
		})

		tx.sign([payer])

		const res = await connection.simulateTransaction(tx)
		expect(res.value.err).toBeNull()

		await sendAndConfirm({ connection, tx })
	})

	it('check bonding curve vault is rent exempt', async () => {
		const rentExempt = await isRentExempt({
			connection: connection,
			address: vault,
		})
		expect(rentExempt).toBe(true)
	})

	it('check bonding curve hodl is rent exempt', async () => {
		const rentExempt = await isRentExempt({
			connection: connection,
			address: hodl,
		})
		expect(rentExempt).toBe(true)
	})

	it('current supply should be 80% of supply', async () => {
		const { currentSupply } = await fetchBondingCurveState({
			program,
			mint: MEME.mint,
		})

		// Convert the supply into the smallest unit considering the decimals
		const supplyBN = new anchor.BN(supply).mul(
			new anchor.BN(10).pow(new anchor.BN(MEME.decimals)),
		)

		// Correctly calculate 80% of the total supply
		const expectedSupply = supplyBN
			.mul(new anchor.BN(80))
			.div(new anchor.BN(100))

		// Ensure that currentSupply equals expectedSupply
		expect(currentSupply.eq(expectedSupply)).toBe(true)
	})

	it('progess should be 0%', async () => {
		const { progress } = await fetchBondingCurveState({
			program,
			mint: MEME.mint,
		})

		const expectedProgress = new BN(0)
		expect(progress.eq(expectedProgress)).toBe(true)
	})

	it('check hodl_sol_ata', async () => {
		const hodlSolAta = await getAssociatedTokenAddress(
			NATIVE_MINT,
			hodl,
			true,
			TOKEN_PROGRAM_ID,
		)

		const account = await getAccount(
			connection,
			hodlSolAta,
			'confirmed',
			TOKEN_PROGRAM_ID,
		)

		console.log(account)

		expect(account.isNative).toBe(true)
		expect(account.isInitialized).toBe(true)
	})

	it('buy token', async () => {
		const amountToBuy = 80

		const ix = await getBuyTokenIxs({
			program,
			payer: payer.publicKey,
			token1Mint: MEME.mint,
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
		expect(res.value.err).toBeNull()
		await sendAndConfirm({ connection, tx })
	})

	it('progess should be 100%', async () => {
		const { progress } = await fetchBondingCurveState({
			program,
			mint: MEME.mint,
		})

		const expectedProgress = new BN(100)
		expect(progress.eq(expectedProgress)).toBe(true)
	})

	it('current supply should be 0', async () => {
		const { currentSupply } = await fetchBondingCurveState({
			program,
			mint: MEME.mint,
		})

		const expectedCurrentSupply = new BN(0)

		expect(currentSupply.eq(expectedCurrentSupply)).toBe(true)
	})

	it('sell token', async () => {
		const amountToSell = 80

		const ix = await getSellTokenIxs({
			program,
			payer: payer.publicKey,
			token1Mint: MEME.mint,
			amount: amountToSell,
		})

		const tx = await buildTransaction({
			connection: connection,
			payer: payer.publicKey,
			instructions: [ix],
			signers: [],
		})

		tx.sign([payer])

		const res = await connection.simulateTransaction(tx)
		expect(res.value.err).toBeNull()

		await sendAndConfirm({ connection, tx })
	})

	it('progess should be 0%', async () => {
		const { progress } = await fetchBondingCurveState({
			program,
			mint: MEME.mint,
		})

		const expectedProgress = new BN(0)

		expect(progress.eq(expectedProgress)).toBe(true)
	})

	it('current supply should be 80% of supply', async () => {
		const { currentSupply } = await fetchBondingCurveState({
			program,
			mint: MEME.mint,
		})

		const supplyBN = new anchor.BN(supply).mul(
			new anchor.BN(10).pow(new anchor.BN(MEME.decimals)),
		)

		const expectedSupply = supplyBN
			.mul(new anchor.BN(80))
			.div(new anchor.BN(100))

		expect(currentSupply.eq(expectedSupply)).toBe(true)
	})
})
