import * as anchor from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import {
	type Degenerator,
	airDrop,
	getMintInstructions,
	buildTransaction,
	sendAndConfirm,
	getPoolVault,
	getRaydiumVault,
	getAssociatedAddress,
	getBuyTokenInstruction,
	getSellTokenInstruction,
	fetchPoolState,
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

	const poolVault = getPoolVault({ program, mint: mint.publicKey })

	const raydiumVault = getRaydiumVault({ program, mint: mint.publicKey })

	const poolATA = getAssociatedAddress({
		mint: mint.publicKey,
		owner: poolVault,
	})

	const payerATA = getAssociatedAddress({
		mint: mint.publicKey,
		owner: payer.publicKey,
	})

	const raydiumATA = getAssociatedAddress({
		mint: mint.publicKey,
		owner: raydiumVault,
	})

	const supply = 100

	const decimals = 9

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
					decimals,
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

	it('check pool state', async () => {
		const data = await fetchPoolState({ program, mint: mint.publicKey })

		const stringifiedData = Object.entries(data).reduce(
			(acc, [key, value]) => {
				acc[key] = value.toString()
				return acc
			},
			{} as Record<string, string>,
		)

		console.log('pool state', stringifiedData)
	})

	it('check pool token amount ', async () => {
		// Fetch pool and user account data
		const pool = await getAccount(
			connection,
			poolATA,
			'processed',
			TOKEN_2022_PROGRAM_ID,
		)

		const raydium = await getAccount(
			connection,
			raydiumATA,
			'processed',
			TOKEN_2022_PROGRAM_ID,
		)

		// Extract amounts (assumed to be BigInt values)
		const poolAmount = pool.amount // BigInt
		const raydiumAmount = raydium.amount // BigInt

		console.log('pool amount', poolAmount.toString())

		console.log('raydium amount', raydiumAmount.toString())

		// supply is 100 tokens with 9 decimals, so multiply by 10^9
		const _supply = BigInt(supply * 10 ** decimals) // total supply in smallest unit
		const expectedPoolAmount = (_supply * BigInt(80)) / BigInt(100) // calculate 80% of supply in smallest unit

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
		const amountToBuy = 80

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
		const amountToSell = 80

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

	it('check pool state', async () => {
		const data = await fetchPoolState({ program, mint: mint.publicKey })

		const stringifiedData = Object.entries(data).reduce(
			(acc, [key, value]) => {
				acc[key] = value.toString()
				return acc
			},
			{} as Record<string, string>,
		)

		console.log('pool state', stringifiedData)
	})
})
