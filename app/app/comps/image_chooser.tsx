'use client'

import type { Dispatch, SetStateAction, RefObject } from 'react'
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
		<label
			className="relative shrink-0 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 items-center justify-center bg-transparent hover:bg-gray-800 focus-visible:bg-gray-800 focus-visible:ring-0 h-8 py-2 flex w-fit select-none gap-2 px-2 text-white/70 hover:text-white sm:w-24 sm:px-3"
			htmlFor="fileUpload"
		>
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
		</label>
	)
}
