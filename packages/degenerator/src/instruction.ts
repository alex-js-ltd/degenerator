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
	getAssociatedAddress,
	getBondingCurveVault,
	getBondingCurveHodl,
	getBondingCurveState,
	getAuthAddress,
	getPoolAddress,
	getPoolLpMintAddress,
	getPoolVaultAddress,
	getOracleAccountAddress,
} from './index'

import { cpSwapProgram, configAddress, createPoolFeeReceive } from './config'

import { ASSOCIATED_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token'

export async function getWrapSolIx({
	program,
	payer,
	amount,
}: {
	program: Program<Degenerator>
	payer: PublicKey
	amount: number
}) {
	const amountBN = new BN(amount)

	const payerATA = await getAssociatedTokenAddress(NATIVE_MINT, payer)

	const wrapSolIx = await program.methods
		.wrapSol(amountBN)
		.accountsStrict({
			payer,
			nativeMint: NATIVE_MINT,
			payerAta: payerATA,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_PROGRAM_ID,
		})
		.instruction()

	return wrapSolIx
}

export async function getCreateMintIxs({
	payer,
	metadata,
	decimals,
	connection,
}: {
	payer: PublicKey
	metadata: TokenMetadata
	decimals: number
	connection: Connection
}) {
	const { mint } = metadata
	const mintSpace = getMintLen([ExtensionType.MetadataPointer])
	const metadataSpace = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length

	const lamports = await connection.getMinimumBalanceForRentExemption(
		mintSpace + metadataSpace,
	)

	const createAccountIx = SystemProgram.createAccount({
		fromPubkey: payer,
		newAccountPubkey: mint,
		space: mintSpace,
		lamports,
		programId: TOKEN_2022_PROGRAM_ID,
	})

	const initializeMetadataPointerIx =
		createInitializeMetadataPointerInstruction(
			mint,
			payer,
			mint,
			TOKEN_2022_PROGRAM_ID,
		)

	const initializeMintIx = createInitializeMintInstruction(
		mint,
		decimals,
		payer,
		null,
		TOKEN_2022_PROGRAM_ID,
	)

	const initializeMetadataIx = createInitializeInstruction({
		mint,
		metadata: mint,
		mintAuthority: payer,
		updateAuthority: payer,
		name: metadata.name,
		symbol: metadata.symbol,
		uri: metadata.uri,
		programId: TOKEN_2022_PROGRAM_ID,
	})

	return [
		createAccountIx,
		initializeMetadataPointerIx,
		initializeMintIx,
		initializeMetadataIx,
	]
}

interface GetInitializeDegeneratorIxsParams {
	program: Program<Degenerator>
	connection: Connection
	payer: PublicKey
	mint: PublicKey
	metadata: TokenMetadata
	decimals: number
	supply: number
}

export async function getInitializeDegeneratorIxs({
	program,
	connection,
	payer,
	metadata,
	decimals,
	supply,
}: GetInitializeDegeneratorIxsParams) {
	const { mint } = metadata
	const supplyBN = new BN(supply)

	const token0Mint = NATIVE_MINT
	const token1Mint = mint

	const vault = getBondingCurveVault({ program, token1Mint })

	const hodl = getBondingCurveHodl({ program, token1Mint })

	const vaultMemeAta = await getAssociatedTokenAddress(
		token1Mint,
		vault,
		true,
		TOKEN_2022_PROGRAM_ID,
	)

	const hodlMemeAta = await getAssociatedTokenAddress(
		token1Mint,
		hodl,
		true,
		TOKEN_2022_PROGRAM_ID,
	)

	const hodlSolAta = await getAssociatedTokenAddress(
		token0Mint,
		hodl,
		true,
		TOKEN_PROGRAM_ID,
	)

	const bondingCurveState = getBondingCurveState({
		program,
		token1Mint,
	})

	const createMintAccountIxs = await getCreateMintIxs({
		payer,
		connection,
		metadata,
		decimals,
	})

	const createPoolIx = await program.methods
		.createBondingCurve(supplyBN)
		.accountsStrict({
			payer,
			token0Mint,
			token1Mint,
			vault,
			hodl,
			vaultMemeAta,
			hodlMemeAta,
			hodlSolAta,
			bondingCurveState,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			token0Program: TOKEN_PROGRAM_ID,
			token1Program: TOKEN_2022_PROGRAM_ID,
			rent: web3.SYSVAR_RENT_PUBKEY,
		})
		.instruction()

	const createRevokeMintIx = createSetAuthorityInstruction(
		mint,
		payer,
		AuthorityType.MintTokens,
		null,
		[],
		TOKEN_2022_PROGRAM_ID,
	)

	return [...createMintAccountIxs, createPoolIx, createRevokeMintIx]
}

interface SwapTokenIxsParams {
	program: Program<Degenerator>
	payer: PublicKey
	token1Mint: PublicKey
	amount: number
}

export async function getBuyTokenIxs({
	program,
	payer,
	token1Mint,
	amount,
}: SwapTokenIxsParams) {
	const payerAta = await getAssociatedTokenAddress(
		token1Mint,
		payer,
		true,
		TOKEN_2022_PROGRAM_ID,
	)

	const vault = getBondingCurveVault({ program, token1Mint })

	const vaultMemeAta = await getAssociatedTokenAddress(
		token1Mint,
		vault,
		true,
		TOKEN_2022_PROGRAM_ID,
	)

	const bondingCurveState = getBondingCurveState({ program, token1Mint })

	const amountBN = new BN(amount)
	const buy = await program.methods
		.buyToken(amountBN)
		.accountsStrict({
			payer,
			vault,
			token1Mint,
			vaultMemeAta,
			payerAta,
			bondingCurveState,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			token1Program: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	return buy
}

export async function getSellTokenIxs({
	program,
	payer,
	token1Mint,
	amount,
}: SwapTokenIxsParams) {
	const payerAta = await getAssociatedTokenAddress(
		token1Mint,
		payer,
		true,
		TOKEN_2022_PROGRAM_ID,
	)

	const vault = getBondingCurveVault({ program, token1Mint })

	const hodl = getBondingCurveHodl({ program, token1Mint })

	const vaultMemeAta = await getAssociatedTokenAddress(
		token1Mint,
		vault,
		true,
		TOKEN_2022_PROGRAM_ID,
	)

	const bondingCurveState = getBondingCurveState({ program, token1Mint })

	const amountBN = new BN(amount)
	const sell = await program.methods
		.sellToken(amountBN)
		.accountsStrict({
			token1Mint,
			signer: payer,
			vault,
			vaultMemeAta,
			payerAta,

			bondingCurveState,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			token1Program: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	return sell
}

interface GetProxyInitIxsParams {
	program: Program<Degenerator>
	configAddress: PublicKey
	token0: PublicKey
	token0Program: PublicKey
	token1: PublicKey
	token1Program: PublicKey
	initAmount: { initAmount0: BN; initAmount1: BN }
	createPoolFee: PublicKey
}

export async function getProxyInitIxs({
	program,
	configAddress,
	token0,
	token0Program,
	token1,
	token1Program,
	initAmount,
	createPoolFee,
}: GetProxyInitIxsParams) {
	const auth = getAuthAddress({ programId: cpSwapProgram })

	const creator = getBondingCurveHodl({ program, token1Mint: token1 })

	const poolAddress = getPoolAddress({
		ammConfig: configAddress,
		tokenMint0: token0,
		tokenMint1: token1,
		programId: cpSwapProgram,
	})

	const lpMintAddress = getPoolLpMintAddress({
		pool: poolAddress,
		programId: cpSwapProgram,
	})

	const vault0 = getPoolVaultAddress({
		pool: poolAddress,
		vaultTokenMint: token0,
		programId: cpSwapProgram,
	})
	const vault1 = getPoolVaultAddress({
		pool: poolAddress,
		vaultTokenMint: token1,
		programId: cpSwapProgram,
	})
	const [creatorLpTokenAddress] = PublicKey.findProgramAddressSync(
		[creator.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), lpMintAddress.toBuffer()],
		ASSOCIATED_PROGRAM_ID,
	)

	const observationAddress = getOracleAccountAddress({
		pool: poolAddress,
		programId: cpSwapProgram,
	})

	const creatorToken0 = getAssociatedTokenAddressSync(
		token0,
		creator,
		false,
		token0Program,
	)
	const creatorToken1 = getAssociatedTokenAddressSync(
		token1,
		creator,
		false,
		token1Program,
	)

	const computeUnitIx = ComputeBudgetProgram.setComputeUnitLimit({
		units: 400000,
	})

	const proxyInitIx = await program.methods
		.proxyInitialize(initAmount.initAmount0, initAmount.initAmount1, new BN(0))
		.accountsStrict({
			cpSwapProgram: cpSwapProgram,
			creator,
			ammConfig: configAddress,
			authority: auth,
			poolState: poolAddress,
			token0Mint: token0,
			token1Mint: token1,
			lpMint: lpMintAddress,
			creatorToken0,
			creatorToken1,
			creatorLpToken: creatorLpTokenAddress,
			token0Vault: vault0,
			token1Vault: vault1,
			createPoolFee: createPoolFee,
			observationState: observationAddress,
			tokenProgram: TOKEN_PROGRAM_ID,
			token0Program: token0Program,
			token1Program: token1Program,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			systemProgram: web3.SystemProgram.programId,
			rent: web3.SYSVAR_RENT_PUBKEY,
		})
		.instruction()

	return [computeUnitIx, proxyInitIx]
}
