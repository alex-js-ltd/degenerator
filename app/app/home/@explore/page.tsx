import { Suspense } from 'react'
import { Tabs, List, Trigger, Content } from '@/app/comps/tabs'
import { Button } from '@/app/comps/button'
import { fetchFeaturedTokens } from '@/app/data/featured_tokens'
import { TokenGrid, Fallback } from '@/app/comps/token_grid'
import { YourTokens } from '@/app/comps/your_tokens'
import { use } from 'react'

function FeaturedTokens() {
	const promise = fetchFeaturedTokens()
	const data = use(promise)
	return <TokenGrid {...data} />
}

export default function Page() {
	return (
		<div className="mx-auto flex max-w-7xl flex-col px-6 pb-20">
			<section className="grid gap-4">
				<h2 className="text-4xl font-semibold">Explore</h2>

				<Tabs>
					<List>
						<Trigger value="tab1" asChild>
							<Button variant="tab">Featured</Button>
						</Trigger>

						<Trigger value="tab2" asChild>
							<Button variant="tab">Your Tokens</Button>
						</Trigger>
					</List>

					<Content value="tab1">
						<Suspense fallback={<Fallback />}>
							<FeaturedTokens />
						</Suspense>
					</Content>

					<Content value="tab2" className="min-h-[165px]">
						<YourTokens />
					</Content>
				</Tabs>
			</section>
		</div>
	)
}
