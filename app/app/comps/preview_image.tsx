'use client'

import type { ListOfErrors } from './field'
import { cn } from '@/app/utils/misc'
import { Icon } from './_icon'

type PreviewImageProps = {
	src: string | undefined
	clearPreviewImage: () => void
	errors: ListOfErrors
}

export function PreviewImage({
	src,
	clearPreviewImage,
	errors,
}: PreviewImageProps) {
	return (
		<div className="w-full h-[69px]">
			<div
				className={
					'flex w-full gap-2 border-b border-white border-opacity-[0.125] p-3'
				}
			>
				<div className="group relative h-[44px] w-[48px] shrink-0 rounded-lg border border-white/10 transition-all duration-500 ease-in-out">
					{src ? (
						<>
							<button
								className="inline-flex shrink-0 items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm absolute -right-1.5 -top-1.5 z-10 h-4 w-4 rounded-full border border-gray-900 bg-gray-100 text-gray-900 opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100"
								onClick={clearPreviewImage}
							>
								<span className="sr-only">Remove image</span>
								<Icon className="h-2.5 w-2.5" name="close" />
							</button>
							<div className="overflow-hidden rounded-lg group-hover:opacity-80">
								<img
									alt="your uploaded image"
									className="relative aspect-[48/44] object-cover object-center"
									src={src}
								/>
							</div>
						</>
					) : null}
				</div>
				{errors?.map(el => (
					<span
						key={el}
						className="text-teal-300 text-xs whitespace-nowrap inline-block"
					>
						{el}
					</span>
				))}
			</div>
		</div>
	)
}
