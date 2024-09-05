import { Program } from '@coral-xyz/anchor'
import { Connection } from '@solana/web3.js'
import { type Degenerator, IDL } from '@repo/degenerator'
import { getEnv } from './env'

const { ENDPOINT } = getEnv()

export const connection = new Connection(ENDPOINT, 'confirmed')

// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.

export const program = new Program<Degenerator>(IDL as Degenerator, {
	connection,
})
