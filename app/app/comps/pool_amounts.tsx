'use client'

import { type ReactElement } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/comps/popover'
import { Button } from '@/app/comps/button'
import { Input, type InputProps } from '@/app/comps/input'
import { Icon } from '@/app/comps/_icon'
import { TokenLogo } from '@/app/comps/token_logo'
import { useControlInput } from '@/app/hooks/use_control_input'
import { useImage } from '@/app/context/image_context'
import { usePool } from '@/app/context/pool_context'

export function PoolAmounts() {
	const amountA = useAmountA()
	const amountB = useAmountB()

	return (
		<Popover modal={true}>
			<PopoverContent
				sticky="always"
				side="bottom"
				align="start"
				alignOffset={0}
				sideOffset={18}
				className="w-[calc(100vw-3rem-2px)] mr-[25px] sm:mr-0 sm:w-[324px] h-auto z-20 overflow-hidden rounded-lg border-gray-800 bg-gray-900 p-0 data-[state=open]:animate-scale-in-95 data-[state=closed]:animate-scale-out-95"
			>
				<fieldset className="grid grid-cols-1 gap-2 p-2 w-full">
					<Field {...amountA} />
					<Field {...amountB} />
				</fieldset>
			</PopoverContent>

			<PopoverTrigger asChild>
				<Button variant="pool">
					🏊‍♂️&nbsp;&nbsp;Pool
					<Icon className="size-[15px] ml-auto" name="arrow" />
				</Button>
			</PopoverTrigger>
		</Popover>
	)
}

function Field({
	logo,
	button,
	inputProps,
}: {
	logo: ReactElement | string
	button?: ReactElement
	inputProps: InputProps
}) {
	return (
		<div className="relative flex items-center h-auto">
			<span className="absolute left-2">{logo}</span>
			<span className="absolute right-2">{button}</span>
			<Input {...inputProps} />
		</div>
	)
}

function Up() {
	return <Button>🆙</Button>
}

function useAmountA() {
	const inputProps = useControlInput('mintAAmount', {
		placeholder: 'Mint A Amount',
		variant: 'pool',
	})

	const { image } = useImage()

	const logo = image ? <TokenLogo {...image} /> : '🤔'

	return { inputProps: { ...inputProps }, logo, button: <Up /> }
}

function useAmountB() {
	const inputProps = useControlInput('mintBAmount', {
		placeholder: 'Mint B Amount',
		variant: 'pool',
	})

	const { selected } = usePool()
	const { image } = selected

	const logo = image ? <TokenLogo {...image} /> : '🌿'

	return { inputProps: { ...inputProps }, logo, button: <Up /> }
}
