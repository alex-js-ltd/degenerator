import { getFeeTierProps } from '@/app/actions/fee_tier'
import { FeeTier } from '@/app/comps/select'

export async function FeeDropdown() {
	const props = await getFeeTierProps()

	return props ? <FeeTier {...props} /> : null
}
