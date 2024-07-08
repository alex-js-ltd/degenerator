import { useState, useRef, useCallback, type ChangeEvent } from 'react'

import type { StaticImageData } from 'next/image'
import pepe from '@/public/pepe.png'

export function useImageUpload() {
	const [previewImage, setPreviewImage] = useState<
		string | StaticImageData | undefined
	>(pepe)

	const fileRef = useRef<HTMLInputElement>(null)

	const clearPreviewImage = useCallback(() => {
		if (fileRef.current) {
			fileRef.current.value = ''
			setPreviewImage(undefined)
		}
	}, [fileRef])

	const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]

		if (file) {
			const reader = new FileReader()

			reader.onloadend = () => {
				setPreviewImage(reader.result as string)
			}
			reader.readAsDataURL(file)
		} else {
			setPreviewImage(undefined)
		}
	}, [])

	return { previewImage, setPreviewImage, fileRef, clearPreviewImage, onChange }
}
