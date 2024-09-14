import * as anchor from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import {
	type Degenerator,
	airDrop,
	getMintInstructions,
	buildTransaction,
	sendAndConfirm,
	getPoolPda,
	getAssociatedAddress,
	getBuyTokenInstruction,
	getSellTokenInstruction,
	getPricePerToken,
} from '../index'
import { getAccount, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'

const { BN } = anchor

describe('initialize', () => {
	const provider = anchor.AnchorProvider.env()
	anchor.setProvider(provider)

	const program = anchor.workspace.Degenerator as anchor.Program<Degenerator>

	const connection = provider.connection

	const payer = Keypair.generate()

	const mint = Keypair.generate()

	const pda = getPoolPda({ program, mint: mint.publicKey })

	const poolATA = getAssociatedAddress({
		mint: mint.publicKey,
		owner: pda,
	})

	const payerATA = getAssociatedAddress({
		mint: mint.publicKey,
		owner: payer.publicKey,
	})

	const supply = 1000000000

	const metadata = {
		name: 'OPOS',
		symbol: 'OPOS',
		uri: 'https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json',
	}

	it('airdrop payer', async () => {
		await airDrop({
			connection,
			account: payer.publicKey,
		})
	})

	it('mint token to payer & init pool', async () => {
		const tx = await buildTransaction({
			connection: connection,
			payer: payer.publicKey,
			instructions: [
				...(await getMintInstructions({
					program,
					payer: payer.publicKey,
					mint: mint.publicKey,
					metadata,
					decimals: 9,
					supply,
				})),
			],
			signers: [mint],
		})

		tx.sign([payer])

		const res = await connection.simulateTransaction(tx)

		expect(res.value.err).toBeNull()

		await sendAndConfirm({ connection, tx })
	})

	it('check pool vault is rent exempt', async () => {
		const accountInfo = await connection.getAccountInfo(pda)

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

	it('check price per token', async () => {
		const data = await getPricePerToken({ program, mint: mint.publicKey })

		console.log('price before', data.pricePerToken.toString())
	})

	it('check pool token amount is 99 times the user amount', async () => {
		// Fetch pool and user account data
		const pool = await getAccount(
			connection,
			poolATA,
			'processed',
			TOKEN_2022_PROGRAM_ID,
		)

		const user = await getAccount(
			connection,
			payerATA,
			'processed',
			TOKEN_2022_PROGRAM_ID,
		)

		// Extract amounts (assumed to be BigInt values)
		const poolAmount = pool.amount // BigInt
		const userAmount = user.amount // BigInt

		console.log('userAmount before', userAmount.toString())

		// Calculate expected pool amount as 9 times the user amount
		const multiplier = BigInt(99) // Create BigInt instance
		const expectedPoolAmount = userAmount * multiplier

		// Assert that the pool amount is equal to the expected amount
		expect(poolAmount).toBe(expectedPoolAmount)
	})

	it('check pool sol amount', async () => {
		// Fetch pool and user account data
		const pool = await connection.getBalance(poolATA)

		console.log(pool)
	})

	it('check user sol amount', async () => {
		// Fetch pool and user account data
		const user = await connection.getBalance(payer.publicKey)

		console.log('payer sol', user)
	})

	it('buy token', async () => {
		const amountToBuy = 100

		const ix = await getBuyTokenInstruction({
			program,
			payer: payer.publicKey,
			mint: mint.publicKey,
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

	it('check pool token ', async () => {
		// Fetch pool and user account data
		const pool = await getAccount(
			connection,
			poolATA,
			'processed',
			TOKEN_2022_PROGRAM_ID,
		)

		const user = await getAccount(
			connection,
			payerATA,
			'processed',
			TOKEN_2022_PROGRAM_ID,
		)

		// Extract amounts (assumed to be BigInt values)
		const poolAmount = pool.amount // BigInt
		const userAmount = user.amount // BigInt

		console.log('userAmount after', userAmount.toString())
	})

	it('sell token', async () => {
		const amountToSell = 100

		const ix = await getSellTokenInstruction({
			program,
			payer: payer.publicKey,
			mint: mint.publicKey,
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
		expect(res.value.err).toBeNull()

		// Confirm the transaction
		await sendAndConfirm({ connection, tx })
	})

	it('check price per token', async () => {
		const data = await getPricePerToken({ program, mint: mint.publicKey })

		console.log('price after', data.pricePerToken.toString())
	})
})
