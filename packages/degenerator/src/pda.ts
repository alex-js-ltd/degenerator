import { Degenerator } from '../target/types/degenerator'
import { Program, BN, utils } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import {
	TOKEN_2022_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
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

export function getExtraMetas({
	program,
	mint,
}: {
	program: Program<Degenerator>
	mint: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[utils.bytes.utf8.encode('extra-account-metas'), mint.toBuffer()],
		program.programId,
	)[0]
}

export function getPoolVault({
	program,
	mint,
}: {
	program: Program<Degenerator>
	mint: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('pool_vault'), mint.toBuffer()],
		program.programId,
	)[0]
}

export function getRaydiumVault({
	program,
	mint,
}: {
	program: Program<Degenerator>
	mint: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('raydium_vault'), mint.toBuffer()],
		program.programId,
	)[0]
}

export function getPoolState({
	program,
	mint,
}: {
	program: Program<Degenerator>
	mint: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('pool_state'), mint.toBuffer()],
		program.programId,
	)[0]
}

export interface PoolState {
	buyPrice: BN
	sellPrice: BN
	currentSupply: BN
	totalSupply: BN
	progress: BN
}

export async function fetchPoolState({
	program,
	mint,
}: {
	program: Program<Degenerator>
	mint: PublicKey
}) {
	const pda = getPoolState({ program, mint })

	const data = await program.account.poolState.fetch(pda)

	return data
}
