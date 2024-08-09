'use client'

import React, { createContext, ReactNode, use } from 'react'
import { type SelectItemConfig } from '@/app/comps/select'
import { useSelectedItem } from '@/app/hooks/use_selected_item'
import invariant from 'tiny-invariant'
import { useMintList } from '../hooks/use_mint_list'

type PoolProviderProps = {
	items: SelectItemConfig[]
	children: ReactNode
}

type Selected = ReturnType<typeof useSelectedItem>
type Context = { items: SelectItemConfig[]; selected: Selected }
const PoolContext = createContext<Context | undefined>(undefined)
PoolContext.displayName = 'PoolContext'

function PoolProvider(props: PoolProviderProps) {
	const mintList = useMintList(props.items)
	const selected = useSelectedItem('mintB', mintList)
	const value = { items: mintList, selected }

	return (
		<PoolContext.Provider value={value}>{props.children}</PoolContext.Provider>
	)
}

function usePool() {
	const context = use(PoolContext)
	invariant(context, 'usePool must be used within a PoolProvider')
	return context
}

export { PoolProvider, usePool }
