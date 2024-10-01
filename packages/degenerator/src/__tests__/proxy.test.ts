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
import {
	getAccount,
	TOKEN_2022_PROGRAM_ID,
	NATIVE_MINT,
} from '@solana/spl-token'

const { BN } = anchor

const SOL = { mint: { publicKey: NATIVE_MINT }, decimals: 9 }
const MY_COIN = {
	mint: Keypair.generate(),
	decimals: 9,
	metadata: {
		name: 'OPOS',
		symbol: 'OPOS',
		uri: 'https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json',
	},
}

describe('initialize', () => {
	const provider = anchor.AnchorProvider.env()
	anchor.setProvider(provider)

	const program = anchor.workspace.Degenerator as anchor.Program<Degenerator>

	const connection = provider.connection

	const payer = Keypair.generate()

	it('airdrop payer', async () => {
		await airDrop({
			connection,
			account: payer.publicKey,
		})
	})

	it('mint token to payer & init bonding curve', async () => {
		const tx = await buildTransaction({
			connection: connection,
			payer: payer.publicKey,
			instructions: [
				...(await getMintInstructions({
					program,
					payer: payer.publicKey,
					mint: MY_COIN.mint.publicKey,
					metadata: MY_COIN.metadata,
					decimals: 9,
					supply: 100,
				})),
			],
			signers: [MY_COIN.mint],
		})

		tx.sign([payer])

		const res = await connection.simulateTransaction(tx)

		expect(res.value.err).toBeNull()

		await sendAndConfirm({ connection, tx })
	})

	it('buy token', async () => {
		const amountToBuy = 80

		const ix = await getBuyTokenInstruction({
			program,
			payer: payer.publicKey,
			mint: MY_COIN.mint.publicKey,
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
