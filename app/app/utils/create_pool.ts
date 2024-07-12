'use server'

import { clmm } from '@/app/actions/clmm'

export async function createPool(formData: FormData) {
	const data = await clmm(undefined, formData)
	return data.serializedTransaction
}
