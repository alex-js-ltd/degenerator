import React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

interface RootProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {}

interface ListProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {}

interface TriggerProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {}

interface ContentProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {}

function Tabs(props: RootProps) {
	return (
		<TabsPrimitive.Root className="grid gap-6" defaultValue="tab1" {...props} />
	)
}

function List(props: ListProps) {
	return <TabsPrimitive.List className="flex items-center gap-2" {...props} />
}

function Trigger(props: TriggerProps) {
	return <TabsPrimitive.Trigger className="flex gap-2" {...props} />
}

function Content({ children, ...props }: ContentProps) {
	return (
		<TabsPrimitive.Content
			className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			{...props}
		>
			<div className="grid auto-cols-[minmax(0,_1fr)]">
				<div className="col-start-1 row-start-1">{children}</div>
			</div>
		</TabsPrimitive.Content>
	)
}

export { Tabs, List, Trigger, Content }
