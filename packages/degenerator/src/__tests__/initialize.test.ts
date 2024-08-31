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
	getTokenAmount,
} from '../index'

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

	const supply = 1000000000

	const metadata = {
		name: 'OPOS',
		symbol: 'OPOS',
		uri: 'https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json',
	}

	it('airdrop payer', async () => {
		await airDrop({
			connection,
			payer,
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

	it('check pool', async () => {
		const amount = await getTokenAmount({ connection, address: poolATA })

		// Convert the fetched amount to a BN
		const amountBN = new BN(amount)

		const supplyBN = new BN(supply)

		// Calculate 90% of the supply
		const transferAmount = supplyBN.mul(new BN(90)).div(new BN(100))

		// Use BN's `eq` method to compare the BN instances
		expect(amountBN.eq(transferAmount)).toBe(true) // .eq() returns a boolean
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

		const res = await connection.simulateTransaction(tx)

		expect(res.value.err).toBeNull()

		const beforeAmount = await getTokenAmount({ connection, address: poolATA })

		await sendAndConfirm({ connection, tx })

		const afterAmount = await getTokenAmount({ connection, address: poolATA })

		// Check that the amount in the pool decreased by the amount of tokens bought
		expect(
			new BN(afterAmount).eq(new BN(beforeAmount).sub(new BN(amountToBuy))),
		).toBe(true)
	})
})
