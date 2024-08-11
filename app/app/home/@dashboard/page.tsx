import { Tabs, List, Trigger, Content } from '@/app/comps/tabs'
import { Button } from '@/app/comps/button'

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
								<ul className="mx-auto grid w-full grid-cols-[repeat(auto-fit,_minmax(296px,1fr))] gap-4">
									<li className="space-y-4 w-full" data-area="result-preview">
										<Card />
										<Token />
									</li>
								</ul>
							</div>
						</div>
					</Content>
				</Tabs>
			</section>
		</div>
	)
}

function Card() {
	return (
		<div className="group relative block aspect-preview w-full overflow-hidden rounded-lg border border-gray-200 shadow transition-all hover:shadow-lg">
			<p className="bg-opacity/80 md:text-xxs absolute right-2 top-2 z-10 rounded-sm bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 md:right-1 md:top-1 md:px-1 md:py-0.5">
				14 seconds ago
			</p>
			<a
				aria-label="View template"
				className="flex h-full items-center"
				draggable="false"
				href="/t/WcZmyvR0E7a"
			>
				<img
					alt="Template for prompt: Crea el mejor banco profesional con todas las opciones que tiene 1 banco y que el idioma cuando inicie este en inglés pero que se pueda cambiar a muchos idiomas y que el banco tenga todo para ser 1 banco y que se llame Banco Vital y este es el logo"
					aria-hidden="true"
					className="object-cover object-top"
					draggable="false"
					loading="eager"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					src="/api/WcZmyvR0E7a/image/edge"
				/>
			</a>
		</div>
	)
}

function Token() {
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<a className="flex-none" href="/~ZJTt3mZvJ9sXL3dGJ4BXR6p6">
					<span className="sr-only">
						Link to ~ZJTt3mZvJ9sXL3dGJ4BXR6p6's v0.dev Profile
					</span>
					<img
						alt=""
						height="32"
						width="32"
						className="shrink-0 select-none rounded-full"
						loading="eager"
						src="https://vercel.com/api/www/avatar/ZJTt3mZvJ9sXL3dGJ4BXR6p6?s=64"
					/>
				</a>
				<button
					className="group relative flex max-w-[70%] items-center"
					title="Crea el mejor banco profesional con todas las opciones que tiene 1 banco y que el idioma cuando inicie este en inglés pero que se pueda cambiar a muchos idiomas y que el banco tenga todo para ser 1 banco y que se llame Banco Vital y este es el logo"
					data-state="closed"
				>
					<div className="relative flex-1 overflow-hidden text-ellipsis rounded-2xl bg-[#ebebeb] px-3 py-1">
						<span className="text-left text-sm line-clamp-1 break-all">
							Crea el mejor banco profesional con todas las opciones que tiene 1
							banco y que el idioma cuando inicie este en inglés pero que se
							pueda cambiar a muchos idiomas y que el banco tenga todo para ser
							1 banco y que se llame Banco Vital y este es el logo
						</span>
						<svg
							className="absolute"
							fill="none"
							height="14"
							style={{ left: '-5.5px', bottom: '0.246px' }}
							width="13"
						>
							<path
								className="fill-[#ebebeb]"
								d="M6 .246c-.175 5.992-1.539 8.89-5.5 13.5 6.117.073 9.128-.306 12.5-3L6 .246Z"
							/>
						</svg>
					</div>
				</button>
			</div>
		</div>
	)
}
