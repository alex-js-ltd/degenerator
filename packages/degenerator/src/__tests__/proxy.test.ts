import * as anchor from '@coral-xyz/anchor'
import { Program, BN } from '@coral-xyz/anchor'
import { Degenerator } from '../../target/types/degenerator'
import { setupInitializeTest, getProxyInitInstruction } from '../index'

describe('proxy test', () => {
	anchor.setProvider(anchor.AnchorProvider.env())
	const owner = anchor.Wallet.local().payer
	console.log('owner: ', owner.publicKey.toString())

	const program = anchor.workspace.Degenerator as Program<Degenerator>

	it('create pool', async () => {})
})
