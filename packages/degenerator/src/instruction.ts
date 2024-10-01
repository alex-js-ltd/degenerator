import { Degenerator } from '../target/types/degenerator'
import { Program, BN, web3 } from '@coral-xyz/anchor'
import {
	type Connection,
	type ConfirmOptions,
	type Signer,
	Keypair,
	PublicKey,
	ComputeBudgetInstruction,
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
	getMint,
	getMetadataPointerState,
	getTokenMetadata,
	TYPE_SIZE,
	LENGTH_SIZE,
} from '@solana/spl-token'

import {
	createInitializeInstruction,
	createUpdateFieldInstruction,
	createRemoveKeyInstruction,
	pack,
	TokenMetadata,
} from '@solana/spl-token-metadata'
import {
	getAssociatedAddress,
	getPoolVault,
	getRaydiumVault,
	getPoolState,
	getExtraMetas,
	getAuthAddress,
	getPoolAddress,
	getPoolLpMintAddress,
	getPoolVaultAddress,
	getOracleAccountAddress,
	createTokenMintAndAssociatedTokenAccount,
} from './index'

import { cpSwapProgram, configAddress, createPoolFeeReceive } from './config'

import { ASSOCIATED_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token'
import { CpmmPoolInfoLayout } from '@raydium-io/raydium-sdk-v2'

async function createMintAccount({
	payer,
	mint,
	metadata,
	decimals,
	connection,
}: {
	payer: PublicKey
	mint: PublicKey
	metadata: TokenMetadata
	decimals: number
	connection: Connection
}) {
	const mintSpace = getMintLen([ExtensionType.MetadataPointer])
	const metadataSpace = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length

	const lamports = await connection.getMinimumBalanceForRentExemption(
		mintSpace + metadataSpace,
	)

	const createAccountIx = SystemProgram.createAccount({
		fromPubkey: payer,
		newAccountPubkey: metadata.mint,
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
}

interface GetMintInstructionsParams {
	program: Program<Degenerator>
	payer: PublicKey
	mint: PublicKey
	metadata: { name: string; symbol: string; uri: string }
	decimals: number
	supply: number
}

export async function getMintInstructions({
	program,
	payer,
	mint,
	metadata,
	decimals,
	supply,
}: GetMintInstructionsParams) {
	// Convert supply to BN (BigNumber) instance
	const supplyBN = new BN(supply)

	const payerATA = getAssociatedAddress({
		mint: mint,
		owner: payer,
	})

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

	const extraMetasAccount = getExtraMetas({ program, mint })

	const poolState = getPoolState({ program, mint })

	const init = await program.methods
		.createMintAccount(decimals, metadata)
		.accountsStrict({
			payer: payer,
			authority: payer,
			receiver: payer,
			mint: mint,
			mintTokenAccount: payerATA,
			extraMetasAccount: extraMetasAccount,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	const createPool = await program.methods
		.createPool(supplyBN)
		.accountsStrict({
			payer: payer,
			poolAta: poolATA,
			mint: mint,
			poolVault: poolVault,
			raydiumVault: raydiumVault,
			raydiumAta: raydiumATA,
			poolState: poolState,
			payerAta: payerATA,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
			rent: web3.SYSVAR_RENT_PUBKEY,
		})
		.instruction()

	const revokeMint = await program.methods
		.revokeMintAuthority()
		.accounts({
			currentAuthority: payer,
			mintAccount: mint,
		})
		.instruction()

	const revokeFreeze = await program.methods
		.revokeFreezeAuthority()
		.accounts({
			currentAuthority: payer,
			mintAccount: mint,
		})
		.instruction()

	return [init, createPool, revokeFreeze, revokeMint]
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

export async function setupInitializeTest(
	connection: Connection,
	owner: Signer,
	transferFeeConfig: { transferFeeBasisPoints: number; MaxFee: number } = {
		transferFeeBasisPoints: 0,
		MaxFee: 0,
	},
	confirmOptions?: ConfirmOptions,
) {
	const [{ token0, token0Program }, { token1, token1Program }] =
		await createTokenMintAndAssociatedTokenAccount(
			connection,
			owner,
			new Keypair(),
			transferFeeConfig,
		)
	return {
		configAddress,
		token0,
		token0Program,
		token1,
		token1Program,
	}
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
