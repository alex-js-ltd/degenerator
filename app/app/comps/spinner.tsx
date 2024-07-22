import { Icon } from './_icon'

export function Spinner() {
	return (
		<Icon
			name="loading"
			className="w-6 h-6 animate-spin text-teal-300"
			aria-label="loading"
		/>
	)
}
