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

	it('check pool amount is 99 times the user amount', async () => {
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

		// Calculate expected pool amount as 9 times the user amount
		const multiplier = BigInt(99) // Create BigInt instance
		const expectedPoolAmount = userAmount * multiplier

		// Assert that the pool amount is equal to the expected amount
		expect(poolAmount).toBe(expectedPoolAmount)
	})

	it('buy token', async () => {
		const amountToBuy = 10

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
		expect(res.value.err).toBeNull()

		// Confirm the transaction
		await sendAndConfirm({ connection, tx })
	})
})
