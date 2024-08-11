import { Tabs, List, Trigger, Content } from '@/app/comps/tabs'
import { Button } from '@/app/comps/button'
import { GeneratedTokens } from '@/app/comps/generated_tokens'
import { getGeneratedTokens } from '@/app/actions/generated'

export default async function Page() {
	const data = await getGeneratedTokens()
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
								<GeneratedTokens {...data} />
							</div>
						</div>
					</Content>
				</Tabs>
			</section>
		</div>
	)
}
