import { Degenerator } from '../target/types/degenerator'
import { Program, BN, web3 } from '@coral-xyz/anchor'
import {
	type Connection,
	type Signer,
	PublicKey,
	ComputeBudgetProgram,
	SystemProgram,
} from '@solana/web3.js'
import {
	NATIVE_MINT,
	TOKEN_PROGRAM_ID,
	TOKEN_2022_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
	getAssociatedTokenAddressSync,
	ExtensionType,
	createInitializeMintInstruction,
	getMintLen,
	createInitializeMetadataPointerInstruction,
	TYPE_SIZE,
	LENGTH_SIZE,
	AuthorityType,
	createSetAuthorityInstruction,
	getAssociatedTokenAddress,
} from '@solana/spl-token'

import {
	createInitializeInstruction,
	pack,
	TokenMetadata,
} from '@solana/spl-token-metadata'
import {
	getExtraMetas,
	getBondingCurveVault,
	getBondingCurveState,
	uiAmountToAmount,
} from './index'

import { cpSwapProgram, configAddress, createPoolFeeReceive } from './config'

import { ASSOCIATED_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token'

interface GetInitializeDegeneratorIxsParams {
	program: Program<Degenerator>

	payer: PublicKey
	mint: PublicKey
	metadata: TokenMetadata
	uiAmount: string
	decimals: number
}

export async function getInitializeDegeneratorIxs({
	program,

	payer,
	metadata,
	uiAmount,
	decimals,
}: GetInitializeDegeneratorIxsParams) {
	const { mint } = metadata

	const vault = getBondingCurveVault({ program, mint })

	const bondingCurveState = getBondingCurveState({
		program,
		mint,
	})

	const payerAta = await getAssociatedTokenAddress(
		mint,
		payer,
		true,
		TOKEN_2022_PROGRAM_ID,
	)

	const vaultAta = await getAssociatedTokenAddress(
		mint,
		vault,
		true,
		TOKEN_2022_PROGRAM_ID,
	)

	const extraMetasAccount = getExtraMetas({ program, mint })

	const createMintAccountIx = await program.methods

		.createMintAccount(decimals, metadata)
		.accountsStrict({
			payer: payer,
			authority: payer,
			receiver: payer,
			mint: mint,
			mintTokenAccount: payerAta,
			extraMetasAccount: extraMetasAccount,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	const amount = uiAmountToAmount(uiAmount, decimals)

	const createBondingCurveIx = await program.methods
		.createBondingCurve(amount)
		.accountsStrict({
			payer,
			mint,
			vault,
			vaultAta,
			bondingCurveState,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
			rent: web3.SYSVAR_RENT_PUBKEY,
		})
		.instruction()

	return [createMintAccountIx, createBondingCurveIx]
}

interface SwapTokenIxsParams {
	program: Program<Degenerator>
	payer: PublicKey
	mint: PublicKey
	uiAmount: string
	decimals: number
}

export async function getBuyTokenIxs({
	program,
	payer,
	mint,
	uiAmount,
	decimals,
}: SwapTokenIxsParams) {
	const payerAta = await getAssociatedTokenAddress(
		mint,
		payer,
		true,
		TOKEN_2022_PROGRAM_ID,
	)

	const vault = getBondingCurveVault({ program, mint })

	const bondingCurveState = getBondingCurveState({ program, mint })

	const amount = uiAmountToAmount(uiAmount, decimals)
	const buy = await program.methods
		.buyToken(amount)
		.accountsStrict({
			payer,
			mint,
			vault,
			payerAta,
			bondingCurveState,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	return buy
}

export async function getSellTokenIxs({
	program,
	payer,
	mint,
	uiAmount,
	decimals,
	bnAmount,
}: SwapTokenIxsParams & { bnAmount: any }) {
	const payerAta = await getAssociatedTokenAddress(
		mint,
		payer,
		true,
		TOKEN_2022_PROGRAM_ID,
	)

	const vault = getBondingCurveVault({ program, mint })

	const bondingCurveState = getBondingCurveState({ program, mint })

	const amount = uiAmountToAmount(uiAmount, decimals)

	const sell = await program.methods
		.sellToken(bnAmount)
		.accountsStrict({
			signer: payer,
			mint,
			vault,
			payerAta,
			bondingCurveState,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	return sell
}
