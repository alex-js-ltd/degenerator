import * as anchor from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import {
	type Degenerator,
	airDrop,
	getWrapSolIx,
	buildTransaction,
	sendAndConfirm,
} from '../index'
import {
	NATIVE_MINT,
	getAssociatedTokenAddress,
	getAccount,
} from '@solana/spl-token'

describe('initialize wrap sol', () => {
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

	it('wrap sol', async () => {
		const ix = await getWrapSolIx({
			program,
			payer: payer.publicKey,
			amount: 100,
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

		// Confirm the transaction
		await sendAndConfirm({ connection, tx })
	})

	it('check account is native', async () => {
		const payerATA = await getAssociatedTokenAddress(
			NATIVE_MINT,
			payer.publicKey,
		)

		const account = await getAccount(connection, payerATA)
		expect(account.isNative).toBe(true)
	})
})
