'use client'

import type { Dispatch, SetStateAction, RefObject } from 'react'
import { Button } from './button'
import { Icon } from '@/app/comps/_icon'
import { type FieldName } from '@conform-to/react'

type ImageChooserProps = {
	name: FieldName<
		File | undefined,
		{
			symbol: string
			name: string
			decimals: number
			image?: File | undefined
		},
		string[]
	>
	fileRef: RefObject<HTMLInputElement>
	setPreviewImage: Dispatch<SetStateAction<string | undefined>>
}

export function ImageChooser({
	name,
	fileRef,
	setPreviewImage,
}: ImageChooserProps) {
	return (
		<Button variant="image">
			<input
				className="absolute z-0 opacity-0 w-full h-full"
				type="file"
				onChange={event => {
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
				}}
				accept="image/*"
				name={name}
				ref={fileRef}
			/>

			<Icon name="upload" className="h-4 w-4" />
			<span className="hidden sm:block">Image</span>
		</Button>
	)
}
