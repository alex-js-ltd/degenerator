'use client'

import { type ReactElement } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/comps/popover'
import { Button, type ButtonProps } from '@/app/comps/button'
import { Input, type InputProps } from '@/app/comps/input'
import { Icon } from '@/app/comps/_icon'
import { TokenLogo } from '@/app/comps/token_logo'
import { useControlInput } from '@/app/hooks/use_control_input'
import { useImage } from '@/app/context/image_context'
import { usePool } from '@/app/context/pool_context'
import { useMaxButton } from '@/app/hooks/use_max_button'
import { useField } from '@conform-to/react'
import { useTokenAccountData } from '@/app/hooks/use_token_account_data'

export function PoolAmounts() {
	const inputA = useControlInput('mintAAmount', {
		placeholder: 'Mint A Amount',
		variant: 'pool',
	})

	const inputB = useControlInput('mintBAmount', {
		placeholder: 'Mint B Amount',
		variant: 'pool',
	})

	const { image } = useImage()
	const logoA = image ? <TokenLogo {...image} /> : '🤔'

	const { selected } = usePool()
	const logoB = selected.image ? <TokenLogo {...selected.image} /> : '🌿'

	const [{ value: balanceA }] = useField<number>('supply')

	const { data } = useTokenAccountData()

	const balanceB = data
		?.find(account => account.mint === selected.meta.value)
		?.balance.toString()

	const buttonA = useMaxButton(balanceA, inputA.control)
	const buttonB = useMaxButton(balanceB, inputB.control)

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
					<Field
						inputProps={{ ...inputA.inputProps }}
						logo={logoA}
						button={<Max {...buttonA} />}
					/>
					<Field
						inputProps={{ ...inputB.inputProps }}
						logo={logoB}
						button={<Max {...buttonB} />}
					/>
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
	button,
	logo,
	inputProps,
}: {
	button: ReactElement
	logo: ReactElement | string
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

function Max(props: ButtonProps) {
	return <Button {...props}>🔝</Button>
}
