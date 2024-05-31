import { Program } from '@coral-xyz/anchor'
import { clusterApiUrl, Connection } from '@solana/web3.js'

import type { Degenerator } from '@/app/types/degenerator'
import IDL from '@/app/idl/degenerator.json'

export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.

export const program = new Program<Degenerator>(IDL as Degenerator, {
	connection,
})
