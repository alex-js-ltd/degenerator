import { useEffect } from 'react'
import { useAsync } from '@/app/hooks/use_async'

interface DeleteTokenResponse {
	message: string
}

async function deleteToken(mint: string): Promise<DeleteTokenResponse> {
	try {
		const response = await fetch(`/api/user?mint=${encodeURIComponent(mint)}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.message || 'Failed to delete token')
		}

		const result: DeleteTokenResponse = await response.json()
		console.log('Success:', result.message)
		return result
	} catch (error) {
		console.error('Error:', (error as Error).message)
		throw error
	}
}

export function useDeleteToken(mint?: string) {
	const { run, ...rest } = useAsync<DeleteTokenResponse>()

	useEffect(() => {
		if (mint) run(deleteToken(mint))
	}, [mint])

	return { ...rest }
}
