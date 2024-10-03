import * as anchor from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import {
	type Degenerator,
	airDrop,
	getInitializeDegeneratorIxs,
	buildTransaction,
	sendAndConfirm,
	getBondingCurveVault,
	getBondingCurveHodl,
	getAssociatedAddress,
	getBuyTokenIxs,
	getSellTokenIxs,
	fetchBondingCurveState,
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

	const bondingCurveVault = getBondingCurveVault({
		program,
		mint: MY_TOKEN.mint,
	})

	const bondingCurveHodl = getBondingCurveHodl({ program, mint: MY_TOKEN.mint })

	const bondingCurveVaultAta = getAssociatedAddress({
		mint: MY_TOKEN.mint,
		owner: bondingCurveVault,
	})

	const payerAta = getAssociatedAddress({
		mint: MY_TOKEN.mint,
		owner: payer.publicKey,
	})

	const bondingCurveHodlAta = getAssociatedAddress({
		mint: MY_TOKEN.mint,
		owner: bondingCurveHodl,
	})

	const supply = 100

	it('airdrop payer', async () => {
		await airDrop({
			connection,
			account: payer.publicKey,
		})
	})

	it('mint token to payer & init pool', async () => {
		const ixs = await getInitializeDegeneratorIxs({
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

		// await sendAndConfirm({ connection, tx })
	})
})
