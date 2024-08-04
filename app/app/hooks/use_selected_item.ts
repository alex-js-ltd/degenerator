import { type SelectItemConfig } from '@/app/comps/select'
import { type FieldName, useField } from '@conform-to/react'
import { useMintList } from './use_mint_list'

export function useSelectedItem(
	name: FieldName<string>,
	items: SelectItemConfig[],
) {
	const [meta] = useField<string>(name)

	const mintList = useMintList({ items })
	const selected = mintList.find(el => el.value === meta.value)
	return { meta, title: selected?.title, imageProps: selected?.imageProps }
}
