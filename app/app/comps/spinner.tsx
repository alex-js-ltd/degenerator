import { Icon } from "./_icon"

export function Spinner() {
	return (
		<div className="relative">
			<Icon name='loading' className="w-6 h-6 animate-spin text-teal-300" />
		</div>
	)
}
