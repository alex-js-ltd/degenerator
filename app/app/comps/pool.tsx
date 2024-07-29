'use client'

import { type SelectItemConfig } from '@/app/comps/select'
import { Popover, Content } from '@/app/comps/popover'
import { Button } from '@/app/comps/button'
import { Input, InputProps } from '@/app/comps/input'
import { Icon } from '@/app/comps/_icon'
import { TokenLogo, type TokenLogoProps } from './token_logo'
import { useSelected } from '@/app/hooks/use_selected'
import { usePoolAmount } from '@/app/hooks/use_pool_amount'

export function Pool({ items }: { items: SelectItemConfig[] }) {
	const { title, imageProps } = useSelected('mintB', items)

	const { inputProps: mintAInputProps } = usePoolAmount(
		'mintAAmount',
		'Mint A Amount',
	)

	const { inputProps: mintBInputProps } = usePoolAmount(
		'mintBAmount',
		'Mint B Amount',
	)

	return (
		<Popover
			content={
				<Content
					side="bottom"
					align="start"
					alignOffset={0}
					sideOffset={20}
					className="w-full h-auto z-20 overflow-hidden rounded-lg border-gray-800 bg-gray-900 p-0"
				>
					<fieldset className="grid grid-cols-2 gap-2 p-2 w-fit">
						<Input {...mintAInputProps} />
						<Input {...mintBInputProps} />
					</fieldset>
				</Content>
			}
		>
			<Button variant="pool">
				🏊‍♂️&nbsp;&nbsp;Pool
				<Icon className="size-[15px] ml-auto" name="arrow" />
			</Button>
		</Popover>
	)
}

function Field({
	logoProps,
	inputProps,
}: {
	logoProps?: TokenLogoProps
	inputProps: InputProps
}) {
	return (
		<div className="relative flex">
			{logoProps ? (
				<TokenLogo {...logoProps} />
			) : (
				<div className="shrink-0 relative flex items-center overflow-hidden h-5 w-5 rounded pr-1 border border-gray-600" />
			)}
			<Input {...inputProps} />
		</div>
	)
}
