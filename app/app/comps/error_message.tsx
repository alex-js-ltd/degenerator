'use client'

import React, { useState, useEffect } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { Icon } from './_icon'
import { getErrorMessage } from '@/app/utils/misc'

type ErrorMessageProps = {
	error: unknown
}
export function ErrorMessage({ error }: ErrorMessageProps) {
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (error) {
			setOpen(true)
		} else {
			setOpen(false)
		}
	}, [error])

	return (
		<ToastPrimitive.Provider swipeDirection="right">
			<ToastPrimitive.Root
				className="bg-error-bg border-2 border-gray-300 rounded-[8px] text-error-text h-[37px] flex items-center px-3"
				open={open}
				onOpenChange={setOpen}
				duration={5000}
			>
				<Icon name="error" className="w-[20px] h-[20px]" />
				<ToastPrimitive.Description className="flex items-center h-full ml-3 text-xs">
					{getErrorMessage(error)}
				</ToastPrimitive.Description>
			</ToastPrimitive.Root>
			<ToastPrimitive.Viewport className="fixed bottom-6 left-6 flex m-0 list-none z-[2147483647] w-fit h-auto" />
		</ToastPrimitive.Provider>
	)
}
