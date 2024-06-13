'use client'

import { type RefObject, type ChangeEvent } from 'react'
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
	onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export function ImageChooser({ name, fileRef, onChange }: ImageChooserProps) {
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
			<input
				className="sr-only pointer-events-none"
				type="file"
				onChange={onChange}
				accept="image/*"
				name={name}
				ref={fileRef}
			/>

			<Icon name="upload" className="h-4 w-4" />
			<span className="hidden sm:block">Image</span>
		</Button>
	)
}
