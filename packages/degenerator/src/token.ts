import {
	NATIVE_MINT,
	TOKEN_PROGRAM_ID,
	TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import { type TokenMetadata } from '@solana/spl-token-metadata'
import { Keypair, PublicKey } from '@solana/web3.js'

// Define SOL token
export const SOL = {
	mint: NATIVE_MINT, // Native mint for SOL
	program: TOKEN_PROGRAM_ID, // Standard SPL Token program ID
	decimals: 9, // SOL has 9 decimals
}

// Function to generate a new token mint
export function generateTokenMint() {
	const token0Mint = NATIVE_MINT // Always use native mint for token 0
	let token1Mint
	let keypair // Declare keypair outside of the loop

	do {
		keypair = Keypair.generate() // Generate a new keypair for token 1
		token1Mint = keypair.publicKey // Assign the public key of the generated keypair
	} while (token0Mint >= token1Mint) // Ensure token 1 mint is greater than token 0 mint

	return {
		keypair,
	}
}

const { keypair } = generateTokenMint() // Destructure to get keypair

const metadata: TokenMetadata = {
	name: 'OPOS',
	symbol: 'OPOS',
	uri: 'https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json',
	additionalMetadata: [],
	mint: keypair.publicKey,
}

// Define your custom token
export const MY_TOKEN = {
	keypair: keypair, // Use the generated keypair
	mint: keypair.publicKey, // Use the generated keypair's publicKey
	program: TOKEN_2022_PROGRAM_ID, // Use the 2022 program for tokens using the extension
	decimals: 9, // Number of decimals for your token (9 is standard, but can be adjusted)
	metadata, // Ensure `metadata` is defined elsewhere in your code
}
