import { Background } from '@/app/comps/background'
import { InitializeForm } from '@/app/comps/initialize_form'

export default async function Page() {
	return (
		<Background>
			<div className="flex w-full flex-col items-center gap-1.5">
				<h2 className="text-4xl font-semibold tracking-tighter sm:text-5xl @media(max-width:480px):text-[2rem]">
					Generate. Mint. Degen.
				</h2>

				<p>Generate SPL tokens on Solana </p>
			</div>
			<InitializeForm />
		</Background>
	)
}
