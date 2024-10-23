import { Degenerator } from '../target/types/degenerator'
import {
	Program,
	BN,
	web3,
	EventParser,
	BorshCoder,
	IdlEvents,
	Event,
} from '@coral-xyz/anchor'
import { IdlEvent } from '@coral-xyz/anchor/dist/cjs/idl'
import { type Connection, type Signer, PublicKey } from '@solana/web3.js'
import {
	TOKEN_2022_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
	getAssociatedTokenAddress,
} from '@solana/spl-token'
import { TokenMetadata } from '@solana/spl-token-metadata'
import {
	getExtraMetas,
	getBondingCurveVault,
	getBondingCurveState,
	uiAmountToAmount,
} from './index'

interface GetInitializeDegeneratorIxsParams {
	program: Program<Degenerator>
	payer: PublicKey
	metadata: Omit<TokenMetadata, 'additionalMetadata'>
	decimals: number
}

export async function getInitializeDegeneratorIxs({
	program,
	payer,
	metadata,
	decimals,
}: GetInitializeDegeneratorIxsParams) {
	const { mint } = metadata

	const vault = getBondingCurveVault({ program, mint })

	const bondingCurveState = getBondingCurveState({
		program,
		mint,
	})

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
			mint: mint,
			extraMetasAccount: extraMetasAccount,
			systemProgram: web3.SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
		})
		.instruction()

	const createBondingCurveIx = await program.methods
		.createBondingCurve()
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

export async function getBuyTokenIx({
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

export async function getSellTokenIx({
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

	const sell = await program.methods
		.sellToken(amount)
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

interface FetchEventsParams {
	program: Program<Degenerator>
	connection: Connection
	mint: PublicKey
}

export async function fetchEvents({
	program,
	mint,
	connection,
}: FetchEventsParams) {
	const transactionList = await connection.getSignaturesForAddress(mint, {
		limit: 1000,
	})

	const signatureList = transactionList.map(
		transaction => transaction.signature,
	)

	const start: Event<IdlEvent, Record<string, never>>[] = []

	const allParsedEvents = signatureList.reduce(async (accProm, sig) => {
		const acc = await accProm

		const tx = await connection.getParsedTransaction(sig, {
			maxSupportedTransactionVersion: 0,
		})

		if (tx?.meta?.logMessages) {
			const eventParser = new EventParser(
				program.programId,
				new BorshCoder(program.idl),
			)

			const events = eventParser.parseLogs(tx.meta.logMessages)
			const eventArray = Array.from(events)

			for (const event of eventArray) {
				acc.push(event)
			}
		}

		return acc
	}, Promise.resolve(start))

	return allParsedEvents
}
