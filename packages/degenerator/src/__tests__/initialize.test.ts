import * as anchor from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import {
	type Degenerator,
	airDrop,
	getinitializeDegeneratorIxs,
	buildTransaction,
	sendAndConfirm,
	getPoolVault,
	getRaydiumVault,
	getAssociatedAddress,
	getBuyTokenInstruction,
	getSellTokenInstruction,
	fetchPoolState,
	SOL,
	MY_TOKEN,
} from '../index'
import { getAccount, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'

const { BN } = anchor

describe('initialize', () => {
	const provider = anchor.AnchorProvider.env()
	anchor.setProvider(provider)

	const program = anchor.workspace.Degenerator as anchor.Program<Degenerator>

	const connection = provider.connection

	const payer = Keypair.generate()

	const poolVault = getPoolVault({ program, mint: MY_TOKEN.mint })

	const raydiumVault = getRaydiumVault({ program, mint: MY_TOKEN.mint })

	const poolATA = getAssociatedAddress({
		mint: MY_TOKEN.mint,
		owner: poolVault,
	})

	const payerATA = getAssociatedAddress({
		mint: MY_TOKEN.mint,
		owner: payer.publicKey,
	})

	const raydiumATA = getAssociatedAddress({
		mint: MY_TOKEN.mint,
		owner: raydiumVault,
	})

	const supply = 100

	it('airdrop payer', async () => {
		await airDrop({
			connection,
			account: payer.publicKey,
		})
	})

	it('mint token to payer & init pool', async () => {
		const ixs = await getinitializeDegeneratorIxs({
			program,
			connection,
			payer: payer.publicKey,
			mint: MY_TOKEN.mint,
			metadata: MY_TOKEN.metadata,
			decimals: MY_TOKEN.decimals,
			supply: supply,
		})

		const tx = await buildTransaction({
			connection: connection,
			payer: payer.publicKey,
			instructions: [...ixs],
			signers: [MY_TOKEN.keypair],
		})

		tx.sign([payer])

		const res = await connection.simulateTransaction(tx)
		console.log(res)
		expect(res.value.err).toBeNull()

		await sendAndConfirm({ connection, tx })
	})

	it('check pool auth is rent exempt', async () => {
		const accountInfo = await connection.getAccountInfo(poolVault)

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
		const { currentSupply } = await fetchPoolState({
			program,
			mint: MY_TOKEN.mint,
		})

		// Convert the supply into the smallest unit considering the decimals
		const supplyBN = new anchor.BN(supply).mul(
			new anchor.BN(10).pow(new anchor.BN(MY_TOKEN.decimals)),
		)

		// Correctly calculate 80% of the total supply
		const expectedSupply = supplyBN
			.mul(new anchor.BN(80))
			.div(new anchor.BN(100))

		console.log('current supply', currentSupply.toString())
		console.log('expected supply', expectedSupply.toString())

		// Ensure that currentSupply equals expectedSupply
		expect(currentSupply.eq(expectedSupply)).toBe(true)
	})

	it('progess should be 0%', async () => {
		const { progress } = await fetchPoolState({
			program,
			mint: MY_TOKEN.mint,
		})

		const expectedProgress = new BN(0)
		expect(progress.eq(expectedProgress)).toBe(true)
	})

	it('buy token', async () => {
		const amountToBuy = 80

		const ix = await getBuyTokenInstruction({
			program,
			payer: payer.publicKey,
			mint: MY_TOKEN.mint,
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

		// Confirm the transaction
		await sendAndConfirm({ connection, tx })
	})

	it('progess should be 100%', async () => {
		const { progress } = await fetchPoolState({
			program,
			mint: MY_TOKEN.mint,
		})

		const expectedProgress = new BN(100)

		// Ensure that currentSupply equals expectedSupply
		expect(progress.eq(expectedProgress)).toBe(true)
	})

	it('current supply should be 0', async () => {
		const { currentSupply } = await fetchPoolState({
			program,
			mint: MY_TOKEN.mint,
		})

		const expectedCurrentSupply = new BN(0)

		// Ensure that currentSupply equals expectedSupply
		expect(currentSupply.eq(expectedCurrentSupply)).toBe(true)
	})
})
