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

type Context = {
	fileRef: RefObject<HTMLInputElement>
	image: string | undefined
	clearImage: () => void
	getInputProps: (name: string) => InputProps
}

const LogoContext = createContext<Context | undefined>(undefined)
LogoContext.displayName = 'LogoContext'

function LogoProvider({ children }: { children: ReactNode }) {
	const [image, setImage] = useState<string | undefined>(undefined)

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
						setImage(reader.result as string)
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

	return <LogoContext.Provider value={value}>{children}</LogoContext.Provider>
}

function useLogo() {
	const context = use(LogoContext)
	invariant(context, 'useLogo must be used within a LogoProvider')
	return context
}

export { LogoProvider, useLogo }
