import { useState, useRef, useCallback } from 'react'

export function useImageUpload() {
	const [previewImage, setPreviewImage] = useState<string | undefined>(
		undefined,
	)

	const fileRef = useRef<HTMLInputElement>(null)

	const clearPreviewImage = useCallback(() => {
		if (fileRef.current) {
			fileRef.current.value = ''
			setPreviewImage(undefined)
		}
	}, [fileRef])

	return { previewImage, setPreviewImage, fileRef, clearPreviewImage }
}
