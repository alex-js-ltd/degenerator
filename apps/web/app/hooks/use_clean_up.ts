import { useInitializeTx } from '@/app/context/tx_context'
import { useEffect } from 'react'
import { useAsync } from '@/app/hooks/use_async'
import { deleteAction } from '@/app/actions/delete_action'

export function useCleanUp(mint?: string) {
	const { isError } = useInitializeTx()
	const { run } = useAsync<string>()

	useEffect(() => {
		if (isError && mint) run(deleteAction(mint))
	}, [isError, mint])
}
