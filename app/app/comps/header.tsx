import { ConnectWallet } from '@/app/comps/connect_wallet'

export function Header() {
	return (
		<div className="sticky top-0 z-20">
			<header className="flex w-full flex-col gap-3 bg-white/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-white/60 md:h-16 md:flex-row md:items-center lg:px-4">
				<div className="flex w-full items-center gap-8">
					<div className="flex items-center gap-2"></div>
					<div className="ml-auto flex items-center gap-2 sm:gap-4">
						<ConnectWallet currentUserClassName="gradient" />
					</div>
				</div>
			</header>
		</div>
	)
}
