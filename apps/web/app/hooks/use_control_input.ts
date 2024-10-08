import { type FieldName, useField, useInputControl } from '@conform-to/react'
import { type InputProps } from '@/app/comps/input'

export type Control = ReturnType<typeof useInputControl<string>>

function getControlProps(control: Control): InputProps {
	return {
		value: control.value || '',
		onChange: e => control.change(e.target.value),
		onFocus: control.focus,
		onBlur: control.blur,
	}
}

function getErrorProps(errors?: string[]) {
	return {
		className: errors?.length ? 'border-teal-300' : undefined,
	}
}

export function useControlInput(
	name: FieldName<string>,
	{ ...rest }: InputProps,
) {
	const [meta] = useField<string>(name)
	const control = useInputControl(meta)

	return {
		inputProps: {
			...getControlProps(control),
			...getErrorProps(meta.errors),
			...rest,
		},
		control,
	}
}
