import { Degenerator } from '../target/types/degenerator'
import { Program, BN, utils } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import {
	TOKEN_2022_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
	NATIVE_MINT,
} from '@solana/spl-token'

export function getAssociatedAddress({
	mint,
	owner,
}: {
	mint: PublicKey
	owner: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[owner.toBuffer(), TOKEN_2022_PROGRAM_ID.toBuffer(), mint.toBuffer()],
		ASSOCIATED_TOKEN_PROGRAM_ID,
	)[0]
}

export function getMemeVault({
	program,
	token1Mint,
}: {
	program: Program<Degenerator>
	token1Mint: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('meme_vault'), token1Mint.toBuffer()],
		program.programId,
	)[0]
}

export function getHodlVault({
	program,
	token1Mint,
}: {
	program: Program<Degenerator>
	token1Mint: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('hodl_vault'), token1Mint.toBuffer()],
		program.programId,
	)[0]
}

export function getSolVault({
	program,
	token1Mint,
}: {
	program: Program<Degenerator>
	token1Mint: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('sol_vault'), NATIVE_MINT.toBuffer(), token1Mint.toBuffer()],
		program.programId,
	)[0]
}

export function getBondingCurveState({
	program,
	token1Mint,
}: {
	program: Program<Degenerator>
	token1Mint: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[
			Buffer.from('bonding_curve_state'),
			NATIVE_MINT.toBuffer(),
			token1Mint.toBuffer(),
		],
		program.programId,
	)[0]
}

export interface BondingCurveState {
	buyPrice: BN
	sellPrice: BN
	currentSupply: BN
	totalSupply: BN
	progress: BN
}

export async function fetchBondingCurveState({
	program,
	mint,
}: {
	program: Program<Degenerator>
	mint: PublicKey
}) {
	const pda = getBondingCurveState({ program, token1Mint: mint })

	const data = await program.account.bondingCurveState.fetch(pda)

	return data
}

// pdas for proxy

export const POOL_AUTH_SEED = Buffer.from(
	utils.bytes.utf8.encode('vault_and_lp_mint_auth_seed'),
)

export const POOL_SEED = Buffer.from(utils.bytes.utf8.encode('pool'))

export const POOL_VAULT_SEED = Buffer.from(
	utils.bytes.utf8.encode('pool_vault'),
)

export const POOL_LPMINT_SEED = Buffer.from(
	utils.bytes.utf8.encode('pool_lp_mint'),
)

export const ORACLE_SEED = Buffer.from(utils.bytes.utf8.encode('observation'))

export function getAuthAddress({ programId }: { programId: PublicKey }) {
	return PublicKey.findProgramAddressSync([POOL_AUTH_SEED], programId)[0]
}

export function getPoolAddress({
	ammConfig,
	tokenMint0,
	tokenMint1,
	programId,
}: {
	ammConfig: PublicKey
	tokenMint0: PublicKey
	tokenMint1: PublicKey
	programId: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[
			POOL_SEED,
			ammConfig.toBuffer(),
			tokenMint0.toBuffer(),
			tokenMint1.toBuffer(),
		],
		programId,
	)[0]
}

export function getPoolLpMintAddress({
	pool,
	programId,
}: {
	pool: PublicKey
	programId: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[POOL_LPMINT_SEED, pool.toBuffer()],
		programId,
	)[0]
}

export function getPoolVaultAddress({
	pool,
	vaultTokenMint,
	programId,
}: {
	pool: PublicKey
	vaultTokenMint: PublicKey
	programId: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[POOL_VAULT_SEED, pool.toBuffer(), vaultTokenMint.toBuffer()],
		programId,
	)[0]
}

export function getOracleAccountAddress({
	pool,
	programId,
}: {
	pool: PublicKey
	programId: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[ORACLE_SEED, pool.toBuffer()],
		programId,
	)[0]
}
