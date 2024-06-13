import { useState, useRef, useCallback, type ChangeEvent } from 'react'

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
