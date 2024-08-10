'use client'

import { type ReactElement } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/comps/popover'
import { Button, type ButtonProps } from '@/app/comps/button'
import { Input, type InputProps } from '@/app/comps/input'
import { Icon } from '@/app/comps/_icon'
import { TokenLogo } from '@/app/comps/token_logo'
import { Control, useControlInput } from '@/app/hooks/use_control_input'
import { useImage } from '@/app/context/image_context'
import { usePool } from '@/app/context/pool_context'
import { useBalance } from '@/app/hooks/use_balance'
import { useUpButton } from '@/app/hooks/use_up_button'
import { NATIVE_MINT, NATIVE_MINT_2022 } from '@solana/spl-token'
import { useField } from '@conform-to/react'

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

	const [supply] = useField<number>('supply')

	const mintBAdress = selected.meta.value
	const isWSOL = mintBAdress === NATIVE_MINT.toBase58()
	const { data: balance } = useBalance()

	function getAmountBButtonProps(): [string, Control] {
		if (isWSOL && balance) return [`${balance}`, inputB.control]
		return [``, inputB.control]
	}

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
						button={
							<Max onClick={() => getMax(supply.value, inputA.control)} />
						}
					/>
					<Field
						inputProps={{ ...inputB.inputProps }}
						logo={logoB}
						button={<Max onClick={() => getMax(...getAmountBButtonProps())} />}
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

function getMax(max: string | undefined, control: Control) {
	control.change(max)
}
