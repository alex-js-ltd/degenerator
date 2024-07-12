import { getQuoteTokenProps } from '@/app/actions/quote_token'
import { QuoteToken } from '@/app/comps/select'

export async function QuoteDropdown() {
	const props = await getQuoteTokenProps()
	return props ? <QuoteToken {...props} /> : null
}
