import * as anchor from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import {
	type Degenerator,
	airDrop,
	getinitializeDegeneratorIxs,
	buildTransaction,
	sendAndConfirm,
	getBuyTokenInstruction,
	getProxyInitInstruction,
	sortTokens,
	SOL,
	MY_TOKEN,
} from '../index'
import {
	getAccount,
	TOKEN_2022_PROGRAM_ID,
	TOKEN_PROGRAM_ID,
	NATIVE_MINT,
} from '@solana/spl-token'
import { configAddress, createPoolFeeReceive } from '../config'

const { BN } = anchor

describe('proxy init', () => {
	const provider = anchor.AnchorProvider.env()
	anchor.setProvider(provider)

	const program = anchor.workspace.Degenerator as anchor.Program<Degenerator>

	const connection = provider.connection

	const payer = Keypair.generate()

	const supply = 1000

	it('airdrop payer', async () => {
		await airDrop({
			connection,
			account: payer.publicKey,
		})
	})

	it('mint token to payer & init bonding curve', async () => {
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

		expect(res.value.err).toBeNull()

		await sendAndConfirm({ connection, tx })
	})

	it('buy token', async () => {
		const amountToBuy = 800

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

	it('proxy init', async () => {
		const tokens = sortTokens([SOL, MY_TOKEN])

		const ix = await getProxyInitInstruction({
			program,
			creator: payer,
			configAddress: configAddress,
			token0: tokens[0].mint,
			token0Program: tokens[0].program,
			token1: tokens[1].mint,
			token1Program: tokens[1].program,
			initAmount: { initAmount0: new BN(100), initAmount1: new BN(100) },
			createPoolFee: createPoolFeeReceive,
		})

		const tx = await buildTransaction({
			connection: connection,
			payer: payer.publicKey,
			instructions: [ix],
			signers: [],
		})

		tx.sign([payer])

		const res = await connection.simulateTransaction(tx)

		console.log(res)
	})
})
