import React, { type ReactNode, type ReactElement } from 'react'
import * as RadixPopver from '@radix-ui/react-popover'

interface PopoverProps {
	children: ReactNode
	content: ReactElement<RadixPopver.PopoverContentProps>
}

function Popover({ children, content }: PopoverProps) {
	return (
		<RadixPopver.Root>
			<RadixPopver.Trigger asChild>{children}</RadixPopver.Trigger>
			<RadixPopver.Portal>{content}</RadixPopver.Portal>
		</RadixPopver.Root>
	)
}

const Content = RadixPopver.Content

export { Popover, Content }
