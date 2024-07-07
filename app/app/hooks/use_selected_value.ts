import { type FieldName, useField } from '@conform-to/react'

export function useSelectedValue({ name }: { name: FieldName<string> }) {
	const [meta] = useField(name)

	return meta.value
}
