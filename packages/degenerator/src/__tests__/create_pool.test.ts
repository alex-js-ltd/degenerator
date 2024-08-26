import * as anchor from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import {
	getAssociatedTokenAddressSync,
	TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import { type Program } from '@coral-xyz/anchor'

import {
	type Degenerator,
	airDrop,
	getMintInstructions,
	buildTransaction,
	sendAndConfirm,
	getAssociatedAddress,
} from '../index'

describe('create pool', () => {
	const provider = anchor.AnchorProvider.env()
	const connection = provider.connection
	anchor.setProvider(provider)

	const program = anchor.workspace.Degenerator as Program<Degenerator>

	const id = Keypair.generate()
	const admin = Keypair.generate()
	const payer = Keypair.generate()
	const mintA = Keypair.generate()
	const mintB = Keypair.generate()

	const ammKey = PublicKey.findProgramAddressSync(
		[id.publicKey.toBuffer()],
		anchor.workspace.Degenerator.programId,
	)[0]

	const poolAuthority = PublicKey.findProgramAddressSync(
		[
			ammKey.toBuffer(),
			mintA.publicKey.toBuffer(),
			mintB.publicKey.toBuffer(),
			Buffer.from('authority'),
		],
		anchor.workspace.Degenerator.programId,
	)[0]
	const mintLiquidity = PublicKey.findProgramAddressSync(
		[
			ammKey.toBuffer(),
			mintA.publicKey.toBuffer(),
			mintB.publicKey.toBuffer(),
			Buffer.from('liquidity'),
		],
		anchor.workspace.Degenerator.programId,
	)[0]

	const poolKey = PublicKey.findProgramAddressSync(
		[ammKey.toBuffer(), mintA.publicKey.toBuffer(), mintB.publicKey.toBuffer()],
		anchor.workspace.Degenerator.programId,
	)[0]

	const poolAccountA = getAssociatedTokenAddressSync(
		mintA.publicKey,
		poolAuthority,
		true,
		TOKEN_2022_PROGRAM_ID,
	)

	const poolAccountB = getAssociatedTokenAddressSync(
		mintB.publicKey,
		poolAuthority,
		true,
		TOKEN_2022_PROGRAM_ID,
	)

	const meta = {
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

	it('create amm', async () => {
		const amm = await program.methods
			.createAmm(id.publicKey, 200)
			.accounts({ admin: admin.publicKey, payer: payer.publicKey })
			.instruction()

		const tx = await buildTransaction({
			connection: connection,
			payer: payer.publicKey,
			instructions: [amm],
			signers: [payer],
		})

		tx.sign([payer])

		const res = await connection.simulateTransaction(tx)
		expect(res.value.err).toBeNull()

		const txSig = await connection.sendTransaction(tx)
		console.log(txSig)
	})

	it('mint token a', async () => {
		const tx = await buildTransaction({
			connection: connection,
			payer: payer.publicKey,
			instructions: [
				...(await getMintInstructions({
					program,
					payer: payer.publicKey,
					mint: mintA.publicKey,
					metadata: { ...meta },
					decimals: 9,
					supply: 100,
				})),
			],
			signers: [mintA],
		})

		tx.sign([payer])

		const res = await connection.simulateTransaction(tx)

		expect(res.value.err).toBeNull()

		await sendAndConfirm({ connection, tx })
	})

	it('mint token b', async () => {
		const tx = await buildTransaction({
			connection: connection,
			payer: payer.publicKey,
			instructions: [
				...(await getMintInstructions({
					program,
					payer: payer.publicKey,
					mint: mintB.publicKey,
					metadata: { ...meta },
					decimals: 9,
					supply: 100,
				})),
			],
			signers: [mintB],
		})

		tx.sign([payer])

		const res = await connection.simulateTransaction(tx)

		expect(res.value.err).toBeNull()

		await sendAndConfirm({ connection, tx })
	})

	it('create pool', async () => {
		const ix = await program.methods
			.createPool()
			.accounts({
				mintA: mintA.publicKey,
				mintB: mintB.publicKey,
				poolAccountA: poolAccountA,
				poolAccountB: poolAccountB,
			})
			.instruction()

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
