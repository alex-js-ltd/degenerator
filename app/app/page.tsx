import { TokenForm } from '@/app/comps/token_form'
import { QuoteDropdown } from '@/app/comps/quote_dropdown'
import { FeeDropdown } from '@/app/comps/fee_dropdown'

export default function Page() {
	return (
		<TokenForm>
			<QuoteDropdown />
			<FeeDropdown />
		</TokenForm>
	)
}
