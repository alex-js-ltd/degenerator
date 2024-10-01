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
} from '@solana/spl-token'

import {
	createInitializeInstruction,
	pack,
	TokenMetadata,
} from '@solana/spl-token-metadata'
import {
	getAssociatedAddress,
	getPoolVault,
	getRaydiumVault,
	getPoolState,
	getAuthAddress,
	getPoolAddress,
	getPoolLpMintAddress,
	getPoolVaultAddress,
	getOracleAccountAddress,
} from './index'

import { cpSwapProgram, configAddress, createPoolFeeReceive } from './config'

import { ASSOCIATED_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token'

export async function createMintAccount({
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

interface GetInitializeDegeneratorParams {
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
}: GetInitializeDegeneratorParams) {
	const { mint } = metadata
	const supplyBN = new BN(supply)

	const poolVault = getPoolVault({ program, mint })

	const poolATA = getAssociatedAddress({
		mint: mint,
		owner: poolVault,
	})

	const raydiumVault = getRaydiumVault({ program, mint })

	const raydiumATA = getAssociatedAddress({
		mint: mint,
		owner: raydiumVault,
	})

	const poolState = getPoolState({ program, mint })

	const createMintAccountIxs = await createMintAccount({
		payer,
		connection,
		metadata,
		decimals,
	})

	const createPoolIx = await program.methods
		.createPool(supplyBN)
		.accountsStrict({
			payer: payer,
			poolAta: poolATA,
			mint: mint,
			poolVault: poolVault,
			raydiumVault: raydiumVault,
			raydiumAta: raydiumATA,
			poolState: poolState,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
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

interface SwapTokenInstructionParams {
	program: Program<Degenerator>
	payer: PublicKey
	mint: PublicKey
	amount: number
}

export async function getBuyTokenInstruction({
	program,
	payer,
	mint,
	amount,
}: SwapTokenInstructionParams) {
	const payerATA = getAssociatedAddress({
		mint: mint,
		owner: payer,
	})

	const poolVault = getPoolVault({ program, mint })

	const poolATA = getAssociatedAddress({
		mint: mint,
		owner: poolVault,
	})

	const poolState = getPoolState({ program, mint })

	const amountBN = new BN(amount)
	const buy = await program.methods
		.buyToken(amountBN)
		.accountsStrict({
			mint: mint,
			signer: payer,
			poolAta: poolATA,
			payerAta: payerATA,
			poolVault: poolVault,
			poolState: poolState,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	return buy
}

export async function getSellTokenInstruction({
	program,
	payer,
	mint,
	amount,
}: SwapTokenInstructionParams) {
	const payerATA = getAssociatedAddress({
		mint: mint,
		owner: payer,
	})

	const poolVault = getPoolVault({ program, mint })

	const poolATA = getAssociatedAddress({
		mint: mint,
		owner: poolVault,
	})

	const poolState = getPoolState({ program, mint })

	const amountBN = new BN(amount)
	const sell = await program.methods
		.sellToken(amountBN)
		.accountsStrict({
			mint: mint,
			signer: payer,
			payerAta: payerATA,
			poolAta: poolATA,
			poolVault: poolVault,
			poolState: poolState,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	return sell
}

interface GetProxyInitInstructionParams {
	program: Program<Degenerator>
	creator: Signer
	configAddress: PublicKey
	token0: PublicKey
	token0Program: PublicKey
	token1: PublicKey
	token1Program: PublicKey
	initAmount: { initAmount0: BN; initAmount1: BN }
	createPoolFee: PublicKey
}

export async function getProxyInitInstruction({
	program,
	creator,
	configAddress,
	token0,
	token0Program,
	token1,
	token1Program,
	initAmount,
	createPoolFee,
}: GetProxyInitInstructionParams) {
	const auth = getAuthAddress({ programId: cpSwapProgram })

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
		[
			creator.publicKey.toBuffer(),
			TOKEN_PROGRAM_ID.toBuffer(),
			lpMintAddress.toBuffer(),
		],
		ASSOCIATED_PROGRAM_ID,
	)

	const observationAddress = getOracleAccountAddress({
		pool: poolAddress,
		programId: cpSwapProgram,
	})

	const creatorToken0 = getAssociatedTokenAddressSync(
		token0,
		creator.publicKey,
		false,
		token0Program,
	)
	const creatorToken1 = getAssociatedTokenAddressSync(
		token1,
		creator.publicKey,
		false,
		token1Program,
	)
	const ix = await program.methods
		.proxyInitialize(initAmount.initAmount0, initAmount.initAmount1, new BN(0))
		.accountsStrict({
			cpSwapProgram: cpSwapProgram,
			creator: creator.publicKey,
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
		.preInstructions([
			ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }),
		])
		.instruction()

	return ix
}
