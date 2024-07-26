'use client'

import { Button } from '@/app/comps/button'
import { Icon } from '@/app/comps/_icon'
import { useLogo } from '@/app/context/logo_context'

export function ImageChooser() {
	const { fileRef, getInputProps } = useLogo()
	return (
		<Button
			type="button"
			variant="image"
			onClick={() => {
				if (fileRef.current) {
					fileRef.current.click()
				}
			}}
		>
			<input {...getInputProps('image')} />

			<Icon name="upload" className="h-4 w-4" />
			<span className="hidden sm:block">Image</span>
		</Button>
	)
}
