import { Degenerator } from '../target/types/degenerator'
import { Program, BN, web3 } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import {
	TOKEN_2022_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import {
	getAssociatedAddress,
	getPoolVault,
	getRaydiumVault,
	getPoolState,
	getExtraMetas,
} from './pda'

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
