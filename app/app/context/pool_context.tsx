'use client'

import React, { createContext, ReactNode, use, useMemo } from 'react'
import { type SelectItemConfig } from '@/app/comps/select'
import { useSelectedItem } from '@/app/hooks/use_selected_item'
import invariant from 'tiny-invariant'

type Selected = ReturnType<typeof useSelectedItem>
type Context = { items: SelectItemConfig[]; mintB: Selected }
const PoolContext = createContext<Context | undefined>(undefined)
PoolContext.displayName = 'PoolContext'

function PoolProvider({
	items,
	children,
}: {
	items: SelectItemConfig[]
	children: ReactNode
}) {
	const mintB = useSelectedItem('mintB', items)

	const value = useMemo(() => {
		return { items, mintB }
	}, [items, mintB])

	return <PoolContext.Provider value={value}>{children}</PoolContext.Provider>
}

function usePool() {
	const context = use(PoolContext)
	invariant(context, 'usePool must be used within a PoolProvider')
	return context
}

export { PoolProvider, usePool }
