import * as anchor from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import {
	type Degenerator,
	airDrop,
	getInitializeDegeneratorIxs,
	buildTransaction,
	sendAndConfirm,
	getBondingCurveVault,
	getAssociatedAddress,
	getBuyTokenIxs,
	getSellTokenIxs,
	fetchBondingCurveState,
	SOL,
	MEME,
} from '../index'
import { getAccount, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'

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
		console.log('init degenerator', res)
		expect(res.value.err).toBeNull()

		await sendAndConfirm({ connection, tx })
	})

	it('check bonding curve vault is rent exempt', async () => {
		const accountInfo = await connection.getAccountInfo(vault)

		if (accountInfo === null) {
			throw new Error('Account not found')
		}

		const minRent = await connection.getMinimumBalanceForRentExemption(
			accountInfo.data.length,
		)
		const isRentExempt = accountInfo.lamports >= minRent

		// Assert that the PDA is rent-exempt
		expect(isRentExempt).toBe(true)
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

		console.log(res)
		expect(res.value.err).toBeNull()

		// Confirm the transaction
		await sendAndConfirm({ connection, tx })
	})

	it('progess should be 100%', async () => {
		const { progress } = await fetchBondingCurveState({
			program,
			mint: MEME.mint,
		})

		const expectedProgress = new BN(100)

		// Ensure that currentSupply equals expectedSupply
		expect(progress.eq(expectedProgress)).toBe(true)
	})

	it('current supply should be 0', async () => {
		const { currentSupply } = await fetchBondingCurveState({
			program,
			mint: MEME.mint,
		})

		const expectedCurrentSupply = new BN(0)

		// Ensure that currentSupply equals expectedSupply
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

		// Simulate the transaction
		const res = await connection.simulateTransaction(tx)
		expect(res.value.err).toBeNull()

		// Confirm the transaction
		await sendAndConfirm({ connection, tx })
	})

	it('progess should be 0%', async () => {
		const { progress } = await fetchBondingCurveState({
			program,
			mint: MEME.mint,
		})

		const expectedProgress = new BN(0)

		// Ensure that currentSupply equals expectedSupply
		expect(progress.eq(expectedProgress)).toBe(true)
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
})
