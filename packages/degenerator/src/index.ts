// Export everything from web3
export * from './web3'

// Export everything from pda
export * from './pda'

// Export everything from instruction
export * from './instruction'

// Export default IDL from target/idl
export { default as IDL } from '../target/idl/degenerator.json'

// Export type Degenerator
export type { Degenerator } from '../target/types/degenerator'
