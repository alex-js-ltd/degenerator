import Image, { ImageProps } from 'next/image'

export type TokenLogoProps = Pick<ImageProps, 'src' | 'alt'>

export function TokenLogo({ src, alt }: TokenLogoProps) {
	return (
		<div className="shrink-0 relative flex items-center overflow-hidden h-5 w-5 rounded pr-1">
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
