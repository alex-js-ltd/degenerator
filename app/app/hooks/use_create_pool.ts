import { clmm } from '@/app/actions/clmm'
import { useCallback } from 'react'
import { VersionedTransaction } from '@solana/web3.js'

export interface CreatePoolProps {
	mint1: string
	formEl: HTMLFormElement
}

export function useCreatePool() {
	return useCallback(async ({ mint1, formEl }: CreatePoolProps) => {
		const formData = new FormData(formEl)
		formData.append('mint1', mint1)
		const data = await clmm(undefined, formData)
		if (!data.serializedTransaction) return

		return VersionedTransaction.deserialize(data.serializedTransaction)
	}, [])
}
