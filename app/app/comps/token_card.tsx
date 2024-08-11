import { type TokenMetadata } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'

function timeAgo(createdAt: Date): string {
	return formatDistanceToNow(createdAt, { addSuffix: true })
}

function TokenCard({ image, name, createdAt }: TokenMetadata) {
	return (
		<div className="group relative block aspect-[16/9] w-full overflow-hidden rounded-lg border border-gray-200 shadow transition-all hover:shadow-lg">
			<p className="bg-opacity-80 md:text-xxs absolute right-2 top-2 z-10 rounded-sm bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 md:right-1 md:top-1 md:px-1 md:py-0.5">
				{timeAgo(createdAt)}
			</p>
			<a
				aria-label="View template"
				className="flex h-full items-center"
				draggable="false"
			>
				<img
					aria-hidden="true"
					className="object-cover object-top w-full h-full"
					draggable="false"
					loading="eager"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					src={image}
					alt={name}
				/>
			</a>
		</div>
	)
}

function LoadingCard() {
	return (
		<div className="group relative block aspect-[16/9] w-full overflow-hidden rounded-lg border border-gray-200 shadow transition-all hover:shadow-lg">
			<div className="w-full h-full bg-gray-200 animate-pulse" />
		</div>
	)
}

export { TokenCard, LoadingCard }
