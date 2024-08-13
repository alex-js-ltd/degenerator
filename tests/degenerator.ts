import * as anchor from '@coral-xyz/anchor'
import { unpack } from '@solana/spl-token-metadata'
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { setUp, mintToken, createValues } from './utils'

const metadataA = {
	name: 'Token A',
	symbol: 'A',
	uri: 'https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json',
}

const metadataB = {
	name: 'Token B',
	symbol: 'B',
	uri: 'https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json',
}

describe('degenerator', () => {
	const { program, provider, wallet } = setUp()

	const mintKeypair = new anchor.web3.Keypair()

	const ATA_PROGRAM_ID = new anchor.web3.PublicKey(
		'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
	)

	it('Create Mint with MetadataPointer and TokenMetadata Extensions', async () => {
		const tx = await program.methods
			.initialize(9, metadataA)
			.accounts({ mintAccount: mintKeypair.publicKey })
			.signers([mintKeypair])
			.rpc({ skipPreflight: true })
		console.log('Your transaction signature', tx)
	})

	it('Create Associated Token Account', async () => {
		const [receiverATA] = anchor.web3.PublicKey.findProgramAddressSync(
			[
				wallet.publicKey.toBytes(),
				TOKEN_2022_PROGRAM_ID.toBytes(),
				mintKeypair.publicKey.toBytes(),
			],
			ATA_PROGRAM_ID,
		)

		const tx = await program.methods
			.createAssociatedTokenAccount()
			.accounts({
				tokenAccount: receiverATA,
				mint: mintKeypair.publicKey,
				signer: wallet.publicKey,
				tokenProgram: TOKEN_2022_PROGRAM_ID,
			})
			.signers([wallet.payer])
			.rpc({ skipPreflight: true })
		console.log('Your transaction signature', tx)
	})

	it('Mint Token to payer', async () => {
		const [payerATA] = anchor.web3.PublicKey.findProgramAddressSync(
			[
				wallet.publicKey.toBytes(),
				TOKEN_2022_PROGRAM_ID.toBytes(),
				mintKeypair.publicKey.toBytes(),
			],
			ATA_PROGRAM_ID,
		)

		const tx = await program.methods
			.mintToken(new anchor.BN(200000000))
			.accounts({
				mint: mintKeypair.publicKey,
				signer: wallet.publicKey,
				receiver: payerATA,
				tokenProgram: TOKEN_2022_PROGRAM_ID,
			})
			.signers([wallet.payer])
			.rpc({ skipPreflight: true })

		console.log('Your transaction signature', tx)
	})

	it('Update existing metadata field', async () => {
		// Add your test here.
		const tx = await program.methods
			.updateField({
				field: { name: {} }, // Update the name field
				value: 'Solana',
			})
			.accounts({ mintAccount: mintKeypair.publicKey })
			.rpc({ skipPreflight: true })
		console.log('Your transaction signature', tx)
	})

	it('Update metadata with custom field', async () => {
		const tx = await program.methods
			.updateField({
				field: { key: { 0: 'color' } }, // Add a custom field named "color"
				value: 'red',
			})
			.accounts({ mintAccount: mintKeypair.publicKey })
			.rpc({ skipPreflight: true })
		console.log('Your transaction signature', tx)
	})

	it('Remove custom field', async () => {
		const tx = await program.methods
			.removeKey('color') // Remove the custom field named "color"
			.accounts({ mintAccount: mintKeypair.publicKey })
			.rpc({ skipPreflight: true })
		console.log('Your transaction signature', tx)
	})

	it('Change update authority', async () => {
		const tx = await program.methods
			.updateAuthority()
			.accounts({
				mintAccount: mintKeypair.publicKey,
				newAuthority: null, // Set the update authority to null
			})
			.rpc({ skipPreflight: true })
		console.log('Your transaction signature', tx)
	})

	it('Emit metadata, decode transaction logs', async () => {
		const txSignature = await program.methods
			.emit()
			.accounts({ mintAccount: mintKeypair.publicKey })
			.rpc({ commitment: 'confirmed', skipPreflight: true })
		console.log('Your transaction signature', txSignature)

		// Fetch the transaction response
		const transactionResponse = await provider.connection.getTransaction(
			txSignature,
			{
				commitment: 'confirmed',
			},
		)

		// Extract the log message that starts with "Program return:"
		const prefix = 'Program return: '
		let log = transactionResponse.meta.logMessages.find(log =>
			log.startsWith(prefix),
		)
		log = log.slice(prefix.length)
		const [_, data] = log.split(' ', 2)

		// Decode the data from base64 and unpack it into TokenMetadata
		const buffer = Buffer.from(data, 'base64')
		const metadata = unpack(buffer)
		console.log('Metadata', metadata)
	})

	it('Emit metadata, decode simulated transaction', async () => {
		const simulateResponse = await program.methods
			.emit()
			.accounts({ mintAccount: mintKeypair.publicKey })
			.simulate()

		// Extract the log message that starts with "Program return:"
		const prefix = 'Program return: '
		let log = simulateResponse.raw.find(log => log.startsWith(prefix))
		log = log.slice(prefix.length)
		const [_, data] = log.split(' ', 2)

		// Decode the data from base64 and unpack it into TokenMetadata
		const buffer = Buffer.from(data, 'base64')
		const metadata = unpack(buffer)
		console.log('Metadata', metadata)
	})

	it('Revoke freeze authority', async () => {
		const tx = await program.methods
			.revokeFreezeAuthority()
			.accounts({
				currentAuthority: wallet.publicKey,
				mintAccount: mintKeypair.publicKey,
			})
			.rpc()

		console.log('Your transaction signature', tx)
	})

	it('Revoke mint authority', async () => {
		const tx = await program.methods
			.revokeMintAuthority()
			.accounts({
				currentAuthority: wallet.publicKey,
				mintAccount: mintKeypair.publicKey,
			})
			.rpc()

		console.log('Your transaction signature', tx)
	})

	it('Creation', async () => {
		const values = createValues()

		await program.methods
			.createAmm(values.id, values.fee)
			.accounts({ amm: values.ammKey, admin: values.admin.publicKey })
			.rpc()

		await mintToken({
			wallet,
			mintKeypair: values.mintAKeypair,
			metadata: metadataA,
			decimals: 9,
			supply: 1000000,
		})

		await mintToken({
			wallet,
			mintKeypair: values.mintBKeypair,
			metadata: metadataB,
			decimals: 9,
			supply: 1000000,
		})

		const tx = await program.methods
			.createPool()
			.accounts({
				amm: values.ammKey,
				pool: values.poolKey,
				poolAuthority: values.poolAuthority,
				mintLiquidity: values.mintLiquidity,
				mintA: values.mintAKeypair.publicKey,
				mintB: values.mintBKeypair.publicKey,
				poolAccountA: values.poolAccountA,
				poolAccountB: values.poolAccountB,
			})
			.rpc({ skipPreflight: true })

		console.log('pool tx', tx)
	})
})
