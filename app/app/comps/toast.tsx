'use client'

import * as RadixToast from '@radix-ui/react-toast'
import { type ReactNode } from 'react'

export interface ToastProps extends RadixToast.ToastProps {
	children: ReactNode
}

function Toast({ children, ...props }: ToastProps) {
	return (
		<RadixToast.Provider swipeDirection="right">
			<RadixToast.Root
				className="relative flex flex-col gap-1 items-start border border-toast-border rounded-[8px] w-fit h-auto p-4 data-[state=open]:animate-scale-in-50 data-[state=closed]:animate-scale-out-50"
				{...props}
			>
				<RadixToast.Close className="absolute top-2 right-2 text-toast-text text-sm">
					x
				</RadixToast.Close>
				{children}
			</RadixToast.Root>

			<RadixToast.Viewport className="fixed bottom-6 left-6 sm:bottom-4 sm:left-4 flex m-0 list-none z-50 w-full max-w-[420px] h-auto" />
		</RadixToast.Provider>
	)
}

const Description = RadixToast.Description

export { Toast, Description }
