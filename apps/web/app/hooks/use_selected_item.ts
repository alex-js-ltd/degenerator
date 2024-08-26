import { type SelectItemConfig } from '@/app/comps/select'
import { type FieldName, useField } from '@conform-to/react'

export function useSelectedItem(
	name: FieldName<string>,
	items: SelectItemConfig[],
) {
	const [meta] = useField<string>(name)

	const selected = items.find(el => el.value === meta.value)
	return { meta, title: selected?.title, image: selected?.image }
}
