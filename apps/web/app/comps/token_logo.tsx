import Image, { type ImageProps } from 'next/image'
import { cn } from '@/app/utils/misc'

export { type ImageProps }

export function TokenLogo({ src, alt, className }: ImageProps) {
	return (
		<div
			className={cn(
				'shrink-0 relative flex items-center overflow-hidden h-5 w-5 rounded pr-1',
				className,
			)}
		>
			<Image
				className="relative aspect-[48/44] object-cover object-center rounded-lg"
				fill={true}
				src={src}
				alt={alt}
				sizes="1.25rem"
			/>
		</div>
	)
}
