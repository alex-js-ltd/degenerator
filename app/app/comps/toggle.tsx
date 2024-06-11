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
		<Button type="button" onClick={toggle} variant="toggle" {...buttonProps}>
			<Input
				className="sr-only"
				type="checkbox"
				checked={on}
				onChange={noop}
				{...inputProps}
			/>
			<div className="flex items-center gap-1.5 focus-within:bg-gray-700">
				{on ? <Revoke /> : <Control />}
				<div className="hidden sm:block">{on ? label.on : label.off}</div>
			</div>
		</Button>
	)
}

function Control() {
	return (
		<div>
			<Icon name="control" className="w-4 h-4 shrink-0" />
		</div>
	)
}

function Revoke() {
	return (
		<div className="translate-x-[2px] translate-y-[0px]">
			<Icon name="revoke" className="w-4 h-4 shrink-0" />
		</div>
	)
}
