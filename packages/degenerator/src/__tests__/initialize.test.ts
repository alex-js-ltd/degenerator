import {
	Program,
	BN,
	web3,
	AnchorProvider,
	setProvider,
	workspace,
} from '@coral-xyz/anchor'
import { type Connection, type PublicKey, Keypair } from '@solana/web3.js'
import {
	type Degenerator,
	airDrop,
	getInitializeDegeneratorIxs,
	buildTransaction,
	sendAndConfirm,
	getBondingCurveVault,
	getBondingCurveState,
	getBuyTokenIx,
	getSellTokenIx,
	fetchBondingCurveState,
	isRentExempt,
	SOL,
	MEME,
	amountToUiAmount,
	bigintToUiAmount,
} from '../index'
import {
	TOKEN_2022_PROGRAM_ID,
	getMint,
	getAssociatedTokenAddress,
	getAccount,
} from '@solana/spl-token'

describe('initialize', () => {
	const provider = AnchorProvider.env()
	setProvider(provider)

	const program = workspace.Degenerator as Program<Degenerator>

	const connection = provider.connection

	const payer = Keypair.generate()

	const vault = getBondingCurveVault({
		program,
		mint: MEME.mint,
	})

	const bondingCurveState = getBondingCurveState({
		program,
		mint: MEME.mint,
	})

	it('airdrop payer', async () => {
		await airDrop({
			connection,
			account: payer.publicKey,
		})
	})

	it('init bonding curve', async () => {
		const ixs = await getInitializeDegeneratorIxs({
			program,
			payer: payer.publicKey,
			metadata: MEME.metadata,
			decimals: MEME.decimals,
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

	it('check bonding curve mint authority is rent exempt', async () => {
		const rentExempt = await isRentExempt({
			connection: connection,
			address: vault,
		})
		expect(rentExempt).toBe(true)
	})

	it('check vault is mint authority', async () => {
		await checkMintAuth({
			connection,
			mint: MEME.mint,
			vault,
		})
	})

	it('init', async () => {
		await checkSupplyMatchesMint({ program, connection, mint: MEME.mint })
	})

	it('buy token', async () => {
		const buyAmount = '100000.0'

		const arr = Array.from({ length: 10 }, (_, index) => index + 1)

		for (const s of arr) {
			const one = await getBuyTokenIx({
				program,
				payer: payer.publicKey,
				mint: MEME.mint,
				uiAmount: buyAmount,
				decimals: MEME.decimals,
			})

			const tx = await buildTransaction({
				connection: connection,
				payer: payer.publicKey,
				instructions: [one],
				signers: [],
			})

			tx.sign([payer])

			// Simulate the transaction
			const res = await connection.simulateTransaction(tx)
			console.log(res.value.logs)
			await sendAndConfirm({ connection, tx })

			const state = await fetchBondingCurveState({ program, mint: MEME.mint })
			console.log('current supply:', state.currentSupply.toString())
			console.log('vault balance:', state.reserveBalance.toString())
			console.log('buy price:', state.buyPrice.toString())
			console.log('sell price:', state.sellPrice.toString())
		}
	}, 120000)

	it('sell all tokens', async () => {
		const payerAta = await getAssociatedTokenAddress(
			MEME.mint,
			payer.publicKey,
			true,
			TOKEN_2022_PROGRAM_ID,
		)

		const account = await getAccount(
			connection,
			payerAta,
			'confirmed',
			TOKEN_2022_PROGRAM_ID,
		)

		const uiAmount = bigintToUiAmount(account.amount, MEME.decimals)

		const ix = await getSellTokenIx({
			program,
			payer: payer.publicKey,
			mint: MEME.mint,
			uiAmount: uiAmount,
			decimals: MEME.decimals,
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

		await sendAndConfirm({ connection, tx })

		const state = await fetchBondingCurveState({ program, mint: MEME.mint })
		console.log('current supply:', state.currentSupply.toString())
		console.log('vault balance:', state.reserveBalance.toString())
	})

	it('user should have 0 tokens', async () => {
		const payerAta = await getAssociatedTokenAddress(
			MEME.mint,
			payer.publicKey,
			true,
			TOKEN_2022_PROGRAM_ID,
		)

		const account = await getAccount(
			connection,
			payerAta,
			'confirmed',
			TOKEN_2022_PROGRAM_ID,
		)

		const state = await fetchBondingCurveState({ program, mint: MEME.mint })

		console.log('current supply:', state.currentSupply.toString())
		console.log('vault balance:', state.reserveBalance.toString())

		expect(account.amount).toEqual(BigInt('0'))
	})
})

async function checkMintAuth({
	connection,
	mint,
	vault,
}: {
	connection: Connection
	mint: PublicKey
	vault: PublicKey
}) {
	const account = await getMint(
		connection,
		mint,
		'confirmed',
		TOKEN_2022_PROGRAM_ID,
	)

	expect(account.mintAuthority?.toBase58()).toBe(vault?.toBase58())
}

// Function using object as the parameter
async function checkSupplyMatchesMint({
	program,
	mint,
	connection,
}: {
	program: Program<Degenerator>
	mint: PublicKey
	connection: Connection
}) {
	// Fetch the bonding curve state
	const state = await fetchBondingCurveState({ program, mint })

	// Get mint account data
	const account = await getMint(
		connection,
		mint,
		'confirmed',
		TOKEN_2022_PROGRAM_ID,
	)

	// Logging for debugging purposes

	console.log('current supply:', state.currentSupply.toString())
	console.log('vault balance:', state.reserveBalance.toString())

	// Convert the supplies to BN and compare
	const stateSupply = new BN(state.currentSupply.toString())
	const accountSupply = new BN(account.supply.toString())

	expect(stateSupply).toEqual(accountSupply)
}
