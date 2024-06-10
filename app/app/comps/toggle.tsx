import { useState } from 'react'
import { Icon } from './_icon'
import { Input, type InputProps } from './input'
import { Button, type ButtonProps } from './button'

type ToggleProps = {
	label: { on: string; off: string }
	inputProps: InputProps
	buttonProps?: ButtonProps
}

const noop = () => {}

export function Toggle({ label, inputProps, buttonProps }: ToggleProps) {
	const [on, setOn] = useState(false)

	const toggle = () => setOn(!on)

	return (
		<Button variant="toggle" type="button" onClick={toggle} {...buttonProps}>
			<Input
				className="sr-only"
				type="checkbox"
				checked={on}
				onChange={noop}
				{...inputProps}
			/>
			<div className="flex items-center gap-1.5 focus-within:bg-gray-700">
				<Icon
					name={on ? 'revoke' : 'control'}
					className="w-4 h-4 shrink-0 translate-x-[-1px] sm:translate-x-0"
				/>
				<div className="hidden sm:block">{on ? label.on : label.off}</div>
			</div>
		</Button>
	)
}
