import { useResetForm } from '@/app/hooks/use_reset_form'
import { useFormStatus } from 'react-dom'
import { Button, type ButtonProps } from './button'
import { Icon } from './_icon'

export function ResetButton({
	onClick,
	isLoading,
}: ButtonProps & { isLoading?: boolean }) {
	const getButtonProps = useResetForm()

	const { pending } = useFormStatus()
	const disabled = pending || isLoading ? true : false
	return (
		<Button
			{...getButtonProps({
				onClick,
				variant: 'reset',
				disabled: disabled,
			})}
		>
			<Icon name="reset" className="size-2.5 text-gray-100 transition-all" />
		</Button>
	)
}
