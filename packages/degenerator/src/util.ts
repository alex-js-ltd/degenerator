import {
	NATIVE_MINT,
	TOKEN_PROGRAM_ID,
	TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import { PublicKey, Keypair } from '@solana/web3.js'
import { type TokenMetadata } from '@solana/spl-token-metadata'

export function sortTokens(
	tokenArray: Array<{ mint: PublicKey; program: PublicKey }>,
) {
	return [...tokenArray].sort((x, y) => {
		if (x.mint < y.mint) {
			return -1
		}
		if (x.mint > y.mint) {
			return 1
		}
		return 0
	})
}

interface Token {
	keypair: Keypair
	mint: PublicKey
	program: PublicKey
	decimals: number
	metadata: TokenMetadata
}

export const SOL: Pick<Token, 'mint' | 'program' | 'decimals'> = {
	mint: NATIVE_MINT,
	program: TOKEN_PROGRAM_ID,
	decimals: 9,
}

const keypair = Keypair.generate()

export const MEME: Token = {
	keypair: keypair,
	mint: keypair.publicKey,
	program: TOKEN_2022_PROGRAM_ID,
	decimals: 9,

	metadata: {
		name: 'OPOS',
		symbol: 'OPOS',
		uri: 'https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json',
		additionalMetadata: [],
		mint: keypair.publicKey,
	},
}
