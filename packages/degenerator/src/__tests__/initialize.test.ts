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
	getBondingCurveAuth,
	getBondingCurveState,
	getBuyTokenIxs,
	getSellTokenIxs,
	fetchBondingCurveState,
	isRentExempt,
	SOL,
	MEME,
} from '../index'
import { TOKEN_2022_PROGRAM_ID, getMint } from '@solana/spl-token'

describe('initialize', () => {
	const provider = AnchorProvider.env()
	setProvider(provider)

	const program = workspace.Degenerator as Program<Degenerator>

	const connection = provider.connection

	const payer = Keypair.generate()

	const mintAuthority = getBondingCurveAuth({
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
			connection,
			payer: payer.publicKey,
			mint: MEME.mint,
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
			address: mintAuthority,
		})
		expect(rentExempt).toBe(true)
	})

	it('check mint authority', async () => {
		await checkMintAuthority({
			connection,
			mint: MEME.mint,
			mintAuthority,
		})
	})

	it('buy token', async () => {
		const amountToBuy = 1

		const one = await getBuyTokenIxs({
			program,
			payer: payer.publicKey,
			mint: MEME.mint,
			amount: amountToBuy,
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
		await sendAndConfirm({ connection, tx })
	})

	it('state supply matches mint supply', async () => {
		await checkSupplyMatchesMint({ program, connection, mint: MEME.mint })
	})

	it('sell token', async () => {
		const amountToSell = 1

		const ix = await getSellTokenIxs({
			program,
			payer: payer.publicKey,
			mint: MEME.mint,
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

		await sendAndConfirm({ connection, tx })
	})

	it('state supply matches mint supply', async () => {
		await checkSupplyMatchesMint({ program, connection, mint: MEME.mint })
	})

	it('supply is 0', async () => {
		const account = await getMint(
			connection,
			MEME.mint,
			'confirmed',
			TOKEN_2022_PROGRAM_ID,
		)

		account.supply

		const expectedSupply = new BN(0)
		const actualSupply = new BN(account.supply.toString())

		console.log('actual supply', actualSupply.toString())

		// Assert that the supplies match
		expect(expectedSupply).toEqual(actualSupply)
	})
})

async function checkMintAuthority({
	connection,
	mint,
	mintAuthority,
}: {
	connection: Connection
	mint: PublicKey
	mintAuthority: PublicKey
}) {
	const account = await getMint(
		connection,
		mint,
		'confirmed',
		TOKEN_2022_PROGRAM_ID,
	)

	expect(account.mintAuthority?.toBase58()).toBe(mintAuthority?.toBase58())
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
	console.log('buy price:', state.buyPrice.toString())
	console.log('sell price:', state.sellPrice.toString())
	console.log('current supply:', state.supply.toString())
	console.log('progress:', state.progress.toString())
	console.log('lamports:', state.lamports.toString())
	console.log('account supply:', account.supply.toString())
	console.log('state supply:', state.supply.toString())

	// Convert the supplies to BN and compare
	const stateSupply = new BN(state.supply.toString())
	const accountSupply = new BN(account.supply.toString())

	// Assert that the supplies match
	expect(stateSupply).toEqual(accountSupply)
}
