'use server'

import { AnchorProvider, BN, Program, Wallet, web3 } from '@coral-xyz/anchor'
import {
	ASSOCIATED_TOKEN_PROGRAM_ID,
	NATIVE_MINT,
	TOKEN_PROGRAM_ID,
	createMint,
	getAssociatedTokenAddressSync,
	getOrCreateAssociatedTokenAccount,
	mintTo,
} from '@solana/spl-token'

import {
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
	PublicKey,
	Transaction,
	sendAndConfirmTransaction,
} from '@solana/web3.js'
import DLMM, { BinLiquidity, LbPosition, StrategyType } from '@meteora-ag/dlmm'

import { connection } from '@/app/utils/setup'
import { parseWithZod } from '@conform-to/zod'
import { PoolSchema } from '@/app/utils/schemas'
import { TransactionMessage, VersionedTransaction } from '@solana/web3.js'

const DEFAULT_ACTIVE_ID = new BN(5660)
const DEFAULT_BIN_STEP = new BN(1)
const DEFAULT_BASE_FACTOR = new BN(10000)
const DEFAULT_BASE_FACTOR_2 = new BN(4000)

const tokenY = new PublicKey('So11111111111111111111111111111111111111112')

export async function dlmm(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: PoolSchema,
	})

	if (submission.status !== 'success') {
		return {
			...submission.reply(),
			serializedTransaction: undefined,
		}
	}

	const { user, tokenX } = submission.value

	const baseKeypair = Keypair.generate()
	const feeBps = new BN(50)
	const lockDurationInSlot = new BN(0)

	const rawTx = await DLMM.createPermissionLbPair(
		connection,
		DEFAULT_BIN_STEP,
		tokenX,
		tokenY,
		DEFAULT_ACTIVE_ID,
		baseKeypair.publicKey,
		user,
		feeBps,
		lockDurationInSlot,
		{ cluster: 'devnet' },
	)

	const instructions = rawTx.instructions.map(el => el)

	let blockhash = await connection
		.getLatestBlockhash()
		.then(res => res.blockhash)

	const messageV0 = new TransactionMessage({
		payerKey: user,
		recentBlockhash: blockhash,
		instructions,
	}).compileToV0Message()

	const transaction = new VersionedTransaction(messageV0)

	const serializedTransaction = transaction.serialize()

	return {
		...submission.reply(),
		serializedTransaction,
	}
}
