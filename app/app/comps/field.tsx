import { Input, type InputProps } from './input'
import { cn } from '@/app/utils/misc'

export type ListOfErrors = Array<string | null | undefined> | null | undefined

export function Field({
	inputProps,
	errors,
}: {
	inputProps: InputProps
	errors: ListOfErrors
}) {
	const id = inputProps.id
	const errorId = errors?.length ? `${id}-error` : undefined

	return (
		<div className={cn('w-full h-[69px] relative', inputProps.className)}>
			{errors?.map(el => (
				<div
					key={el}
					className="text-teal-300 text-xs absolute -top-3 left-3 flex"
				>
					{el}
				</div>
			))}
			<div className="relative flex w-full gap-2 border-b border-opacity-[0.125] p-3 transition duration-500 ease-in-out border-white">
				<Input
					id={id}
					aria-invalid={errorId ? true : undefined}
					aria-describedby={errorId}
					{...inputProps}
				/>
			</div>
		</div>
	)
}
