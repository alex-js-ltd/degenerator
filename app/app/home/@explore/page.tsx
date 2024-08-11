import { Suspense } from 'react'

import { Tabs, List, Trigger, Content } from '@/app/comps/tabs'
import { Button } from '@/app/comps/button'
import { GeneratedTokens } from '@/app/comps/generated_tokens'

export default async function Page() {
	return (
		<div className="mx-auto flex max-w-7xl flex-col px-6 pb-20">
			<section className="grid gap-4">
				<h2 className="text-4xl font-semibold">Explore</h2>

				<Tabs>
					<List>
						<Trigger value="tab1" asChild>
							<Button variant="tab">Your Tokens</Button>
						</Trigger>

						<Trigger value="tab2" asChild>
							<Button variant="tab">Featured</Button>
						</Trigger>
					</List>

					<Content value="tab1">
						<div className="grid auto-cols-[minmax(0,_1fr)]">
							<div className="col-start-1 row-start-1">
								<Suspense>
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
