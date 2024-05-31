import { Program } from '@coral-xyz/anchor'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'

import type { Metadata } from '@/app/types/metadata'
import IDL from '@/app/idl/metadata.json'

export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.

export const program = new Program<Metadata>(IDL as Metadata, {
	connection,
})
