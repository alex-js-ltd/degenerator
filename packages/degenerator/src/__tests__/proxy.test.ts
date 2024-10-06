import * as anchor from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import {
	type Degenerator,
	airDrop,
	getInitializeDegeneratorIxs,
	buildTransaction,
	sendAndConfirm,
	getBuyTokenIxs,
	getProxyInitIxs,
	sortTokens,
	getBondingCurveHodl,
	SOL,
	MEME,
	getCreateWrappedSolIx,
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

	const creator = getBondingCurveHodl({ program, token1Mint: MEME.mint })

	const supply = 100000

	it('airdrop payer', async () => {
		await airDrop({
			connection,
			account: payer.publicKey,
		})
	})

	it('mint token to payer & init bonding curve', async () => {
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

	it('airdrop creator', async () => {
		await airDrop({
			connection,
			account: creator,
		})
	})

	it('create wrapped sol account', async () => {
		const ix = await getCreateWrappedSolIx({
			program,
			payer: payer.publicKey,
			token1Mint: MEME.mint,
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
		// expect(res.value.err).toBeNull()
		await sendAndConfirm({ connection, tx })
	})

	it('airdrop creator', async () => {
		await airDrop({
			connection,
			account: creator,
		})
	})

	it('proxy init', async () => {
		const tokens = [SOL, MEME]

		const ixs = await getProxyInitIxs({
			program,
			creator: creator,
			configAddress: configAddress,
			token0: tokens[0].mint,
			token0Program: tokens[0].program,
			token1: tokens[1].mint,
			token1Program: tokens[1].program,
			initAmount: { initAmount0: new BN(50), initAmount1: new BN(50) },
			createPoolFee: createPoolFeeReceive,
		})

		const tx = await buildTransaction({
			connection: connection,
			payer: payer.publicKey,
			instructions: [...ixs],
			signers: [],
		})

		tx.sign([payer])

		const res = await connection.simulateTransaction(tx)
		console.log('units consumed', res.value.unitsConsumed)
		console.log(res)
	})
})
