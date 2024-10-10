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
	getBuyTokenIxs,
	getSellTokenIxs,
	fetchBondingCurveState,
	isRentExempt,
	SOL,
	MEME,
} from '../index'
import {
	TOKEN_2022_PROGRAM_ID,
	getMint,
	getAssociatedTokenAddress,
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
		console.log(res)
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
		const amountToBuy = '10.500000000'

		const one = await getBuyTokenIxs({
			program,
			payer: payer.publicKey,
			mint: MEME.mint,
			uiAmount: amountToBuy,
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

		console.log(res)
		await sendAndConfirm({ connection, tx })

		await checkSupplyMatchesMint({ program, connection, mint: MEME.mint })
	})

	it('sell token', async () => {
		const amountToSell = '5.250000000'

		const ix = await getSellTokenIxs({
			program,
			payer: payer.publicKey,
			mint: MEME.mint,
			uiAmount: amountToSell,
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
		await sendAndConfirm({ connection, tx })
		await checkSupplyMatchesMint({ program, connection, mint: MEME.mint })
	})

	it('check bonding curve mint authority is rent exempt', async () => {
		const rentExempt = await isRentExempt({
			connection: connection,
			address: vault,
		})
		expect(rentExempt).toBe(true)
	})

	it('check bonding curve state is rent exempt', async () => {
		const rentExempt = await isRentExempt({
			connection: connection,
			address: bondingCurveState,
		})
		expect(rentExempt).toBe(true)
	})

	it('check payer ata', async () => {
		const payerAta = await getAssociatedTokenAddress(
			MEME.mint,
			payer.publicKey,
			false,
			TOKEN_2022_PROGRAM_ID,
		)
		const rentExempt = await isRentExempt({
			connection: connection,
			address: payerAta,
		})
		expect(rentExempt).toBe(true)
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
	console.log('base price:', state.basePrice.toString())
	console.log('buy price:', state.buyPrice.toString())
	console.log('sell price:', state.sellPrice.toString())
	console.log('total supply:', state.totalSupply.toString())
	console.log('vault balance:', state.vaultBalance.toString())
	console.log('account supply:', account.supply.toString())
	console.log('reserve ration:', state.reserveRatio.toString())

	// Convert the supplies to BN and compare
	const stateSupply = new BN(state.totalSupply.toString())
	const accountSupply = new BN(account.supply.toString())

	expect(stateSupply).toEqual(accountSupply)
}
