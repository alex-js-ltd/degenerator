import * as anchor from '@coral-xyz/anchor'
import { PublicKey, Keypair } from '@solana/web3.js'
import {
	type Degenerator,
	airDrop,
	getMintInstructions,
	buildTransaction,
	sendAndConfirm,
	getPoolVault,
	getOrcaVault,
	getAssociatedAddress,
	getBuyTokenInstruction,
	getSellTokenInstruction,
	fetchPoolState,
} from '../index'
import {
	getAccount,
	TOKEN_2022_PROGRAM_ID,
	NATIVE_MINT,
} from '@solana/spl-token'

const { BN } = anchor

describe('initialize', () => {
	const provider = anchor.AnchorProvider.env()
	anchor.setProvider(provider)

	const program = anchor.workspace.Degenerator as anchor.Program<Degenerator>

	const connection = provider.connection

	const payer = Keypair.generate()

	const SOL = {
		mint: NATIVE_MINT,
		decimals: 9,
	}
	const WIF = { mint: Keypair.generate(), decimals: 9 }

	const poolVault = getPoolVault({ program, mint: WIF.mint.publicKey })

	const orcaVault = getOrcaVault({ program, mint: WIF.mint.publicKey })

	const poolATA = getAssociatedAddress({
		mint: WIF.mint.publicKey,
		owner: poolVault,
	})

	const payerATA = getAssociatedAddress({
		mint: WIF.mint.publicKey,
		owner: payer.publicKey,
	})

	const orcaATA = getAssociatedAddress({
		mint: WIF.mint.publicKey,
		owner: orcaVault,
	})

	const supply = 100

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
					mint: WIF.mint.publicKey,
					metadata,
					decimals: WIF.decimals,
					supply,
				})),
			],
			signers: [WIF.mint],
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

	it('current supply should be 80% of supply', async () => {
		const { currentSupply } = await fetchPoolState({
			program,
			mint: WIF.mint.publicKey,
		})

		// Convert the supply into the smallest unit considering the decimals
		const supplyBN = new anchor.BN(supply).mul(
			new anchor.BN(10).pow(new anchor.BN(WIF.decimals)),
		)

		// Correctly calculate 80% of the total supply
		const expectedSupply = supplyBN
			.mul(new anchor.BN(80))
			.div(new anchor.BN(100))

		// Ensure that currentSupply equals expectedSupply
		expect(currentSupply.eq(expectedSupply)).toBe(true)
	})

	it('buy token', async () => {
		const amountToBuy = 80

		const ix = await getBuyTokenInstruction({
			program,
			payer: payer.publicKey,
			mint: WIF.mint.publicKey,
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
			mint: WIF.mint.publicKey,
		})

		const expectedProgress = new BN(100)

		// Ensure that currentSupply equals expectedSupply
		expect(progress.eq(expectedProgress)).toBe(true)
	})

	it('current supply should be 0', async () => {
		const { currentSupply } = await fetchPoolState({
			program,
			mint: WIF.mint.publicKey,
		})

		const expectedCurrentSupply = new BN(0)

		// Ensure that currentSupply equals expectedSupply
		expect(currentSupply.eq(expectedCurrentSupply)).toBe(true)
	})

	it('sell token', async () => {
		const amountToSell = 80

		const ix = await getSellTokenInstruction({
			program,
			payer: payer.publicKey,
			mint: WIF.mint.publicKey,
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
		const { progress } = await fetchPoolState({
			program,
			mint: WIF.mint.publicKey,
		})

		const expectedProgress = new BN(0)
		expect(progress.eq(expectedProgress)).toBe(true)
	})
})
