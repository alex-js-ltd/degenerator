import { Degenerator } from '../target/types/degenerator'
import { Program, BN, utils } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import {
	TOKEN_2022_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
	NATIVE_MINT,
} from '@solana/spl-token'

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

export function getBondingCurveVault({
	program,
	mint,
}: {
	program: Program<Degenerator>
	mint: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('bonding_curve_vault'), mint.toBuffer()],
		program.programId,
	)[0]
}

export function getBondingCurveState({
	program,
	mint,
}: {
	program: Program<Degenerator>
	mint: PublicKey
}): PublicKey {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('bonding_curve_state'), mint.toBuffer()],
		program.programId,
	)[0]
}

export interface BondingCurveState {
	buyPrice: BN
	sellPrice: BN
	currentSupply: BN
	progress: BN
}

export async function fetchBondingCurveState({
	program,
	mint,
}: {
	program: Program<Degenerator>
	mint: PublicKey
}) {
	const pda = getBondingCurveState({ program, mint })

	const data = await program.account.bondingCurveState.fetch(pda)

	return data
}
