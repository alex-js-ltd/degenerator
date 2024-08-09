import { usePool } from '@/app/context/pool_context'

export function useMintB() {
	const { mintB } = usePool()
	return mintB
}
