import { useState, createContext, useContext, type ReactNode } from 'react'
import { Input, type InputProps } from './input'
import { Icon } from './_icon'
import { Button } from '@/app/comps/button'

const ToggleContext = createContext<
	{ on: boolean; toggle: () => void } | undefined
>(undefined)
ToggleContext.displayName = 'ToggleContext'

function Toggle({ children }: { children: ReactNode }) {
	const [on, setOn] = useState(false)
	const toggle = () => setOn(!on)

	return (
		<ToggleContext.Provider value={{ on, toggle }}>
			{children}
		</ToggleContext.Provider>
	)
}

function useToggle() {
	const context = useContext(ToggleContext)
	if (context === undefined) {
		throw new Error('useToggle must be used within a <Toggle />')
	}
	return context
}

function On({ children }: { children: ReactNode }) {
	const { on, toggle } = useToggle()

	if (!on) return null

	return (
		<Button type="button" onClick={toggle} variant="toggle">
			{children}
		</Button>
	)
}

function Off({ children }: { children: ReactNode }) {
	const { on, toggle } = useToggle()

	if (on) return null

	return (
		<Button type="button" onClick={toggle} variant="toggle">
			{children}
		</Button>
	)
}

const noop = () => {}

function Checkbox({ inputProps }: { inputProps: InputProps }) {
	const { on } = useToggle()
	return (
		<Input
			className="sr-only"
			type="checkbox"
			checked={on}
			onChange={noop}
			{...inputProps}
		/>
	)
}

Toggle.On = On
Toggle.Off = Off
Toggle.Input = Checkbox

function MintToggle() {
	return (
		<Toggle>
			<Toggle.On>
				<Icon
					name="revoke"
					className="w-4 h-4 shrink-0 translate-x-[2px] translate-y-[0px]"
				/>
				<div className="hidden sm:block">Mint Authority</div>
			</Toggle.On>

			<Toggle.Off>
				<Icon name="control" className="w-4 h-4 shrink-0" />
				<div className="hidden sm:block">Mint Authority</div>
			</Toggle.Off>

			<Toggle.Input inputProps={{ name: 'revokeMint' }} />
		</Toggle>
	)
}

function FreezeToggle() {
	return (
		<Toggle>
			<Toggle.On>
				<Icon
					name="revoke"
					className="w-4 h-4 shrink-0 translate-x-[2px] translate-y-[0px]"
				/>
				<div className="hidden sm:block">Freeze Authority</div>
			</Toggle.On>

			<Toggle.Off>
				<Icon name="control" className="w-4 h-4 shrink-0" />
				<div className="hidden sm:block">Freeze Authority</div>
			</Toggle.Off>

			<Toggle.Input inputProps={{ name: 'revokeFreeze' }} />
		</Toggle>
	)
}

export { Toggle, MintToggle, FreezeToggle }
