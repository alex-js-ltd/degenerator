import { useState, createContext, useContext, type ReactNode } from 'react'
import { Switch } from './switch'

const ToggleContext = createContext<
	{ on: boolean; toggle: () => void } | undefined
>(undefined)
ToggleContext.displayName = 'ToggleContext'

function Toggle({ children }: { children: ReactNode }) {
	const [on, setOn] = useState(false)
	const toggle = () => setOn(!on)

	console.log('on', on)

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

function ToggleOn({ children }: { children: ReactNode }) {
	const { on } = useToggle()
	return on ? children : null
}

function ToggleOff({ children }: { children: ReactNode }) {
	const { on } = useToggle()
	return on ? null : children
}

function ToggleButton({ ...props }) {
	const { on, toggle } = useToggle()
	return <Switch on={on} onClick={toggle} {...props} />
}

export { Toggle, ToggleOn, ToggleOff, ToggleButton }
