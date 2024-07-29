'use client'

import React, {
	type RefObject,
	type ReactNode,
	createContext,
	useMemo,
	use,
	useCallback,
	useState,
	useRef,
} from 'react'
import { type InputProps } from '@/app/comps/input'
import invariant from 'tiny-invariant'
import { type ImageProps } from 'next/image'

type Context = {
	fileRef: RefObject<HTMLInputElement>
	image?: ImageProps
	clearImage: () => void
	getInputProps: (name: string) => InputProps
}

const ImageContext = createContext<Context | undefined>(undefined)
ImageContext.displayName = 'ImageContext'

function ImageProvider({ children }: { children: ReactNode }) {
	const [image, setImage] = useState<ImageProps | undefined>(undefined)

	const fileRef = useRef<HTMLInputElement>(null)

	const clearImage = useCallback(() => {
		if (fileRef.current) {
			fileRef.current.value = ''
			setImage(undefined)
		}
	}, [])

	const getInputProps = useCallback<(name: string) => InputProps>(name => {
		return {
			className: 'sr-only pointer-events-none',
			type: 'file',
			accept: 'image/*',
			name,
			ref: fileRef,
			onChange(e) {
				const file = e.target.files?.[0]

				if (file) {
					const reader = new FileReader()

					reader.onloadend = () => {
						setImage({
							src: reader.result as string,
							alt: 'your uploaded image',
						})
					}
					reader.readAsDataURL(file)
				} else {
					setImage(undefined)
				}
			},
		}
	}, [])

	const value = useMemo(
		() => ({ fileRef, image, clearImage, getInputProps }),
		[image, clearImage, getInputProps],
	)

	return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
}

function useImage() {
	const context = use(ImageContext)
	invariant(context, 'useImage must be used within a ImageProvider')
	return context
}

export { ImageProvider, useImage }
