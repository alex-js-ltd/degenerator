import { Suspense } from 'react'
import { Tabs, List, Trigger, Content } from '@/app/comps/tabs'
import { Button } from '@/app/comps/button'
import { fetchFeaturedTokens } from '@/app/data/featured_tokens'
import { TokenGrid, Fallback } from '@/app/comps/token_grid'
import { YourTokens } from '@/app/comps/your_tokens'

import { type TokenMetadata } from '@prisma/client'

interface Data {
	data: TokenMetadata[]
}

export async function fetchYourTokens(id: string): Promise<Data> {
	const res = await fetch(`api/user/${id}`)
	const data = res.json()
	return data
}

export const revalidate = 60 // revalidate at most every minute

export const dynamic = 'force-dynamic'

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

						<Trigger value="tab2" asChild>
							<Button variant="tab">Your Tokens</Button>
						</Trigger>
					</List>

					<Content value="tab1">
						<div className="grid auto-cols-[minmax(0,_1fr)]">
							<div className="col-start-1 row-start-1">
								<Suspense fallback={<Fallback />}>
									<TokenGrid {...await fetchFeaturedTokens()} />
								</Suspense>
							</div>
						</div>
					</Content>

					<Content value="tab2">
						<div className="grid auto-cols-[minmax(0,_1fr)]">
							<div className="col-start-1 row-start-1">
								<Suspense fallback={<Fallback />}>
									<YourTokens />
								</Suspense>
							</div>
						</div>
					</Content>
				</Tabs>
			</section>
		</div>
	)
}
