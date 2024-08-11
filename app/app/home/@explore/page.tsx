import { Suspense } from 'react'
import { Tabs, List, Trigger, Content } from '@/app/comps/tabs'
import { Button } from '@/app/comps/button'
import { getGeneratedTokens } from '@/app/actions/generated'
import { TokenCard, LoadingCard } from '@/app/comps/token_card'

export default async function Page() {
	return (
		<div className="mx-auto flex max-w-7xl flex-col px-6 pb-20">
			<section className="grid gap-4">
				<h2 className="text-4xl font-semibold">Explore</h2>

				<Tabs>
					<List>
						<Trigger value="tab1" asChild>
							<Button variant="tab">Featured</Button>
						</Trigger>
					</List>

					<Content value="tab1">
						<div className="grid auto-cols-[minmax(0,_1fr)]">
							<div className="col-start-1 row-start-1">
								<Suspense fallback={<Loading />}>
									<GeneratedTokens />
								</Suspense>
							</div>
						</div>
					</Content>
				</Tabs>
			</section>
		</div>
	)
}

async function GeneratedTokens() {
	const data = await getGeneratedTokens()
	return (
		<ul className="mx-auto grid w-full grid-cols-[repeat(auto-fit,_minmax(296px,1fr))] gap-4">
			{data.tokens?.map(token => (
				<li key={token.id} className="space-y-4 w-full">
					<TokenCard {...token} />
				</li>
			))}
		</ul>
	)
}

const loading = Array.from({ length: 10 }, (v, index) => ({
	id: `loading-card-${index}`,
}))

function Loading() {
	return (
		<ul className="mx-auto grid w-full grid-cols-[repeat(auto-fit,_minmax(296px,1fr))] gap-4">
			{loading?.map(card => (
				<li key={card.id} className="space-y-4 w-full h-[165px]">
					<LoadingCard />
				</li>
			))}
		</ul>
	)
}
