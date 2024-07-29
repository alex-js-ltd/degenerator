'use client'

import { type SelectItemConfig } from '@/app/comps/select'
import { Popover, Content } from '@/app/comps/popover'
import { Button } from '@/app/comps/button'
import { Input, InputProps } from '@/app/comps/input'
import { Icon } from '@/app/comps/_icon'
import { TokenLogo, type ImageProps } from '@/app/comps/token_logo'
import { useSelected } from '@/app/hooks/use_selected'
import { usePoolAmount } from '@/app/hooks/use_pool_amount'
import { useImage } from '@/app/context/image_context'

export function Pool({ items }: { items: SelectItemConfig[] }) {
	const mintAInputProps = usePoolAmount('mintAAmount', 'Mint A Amount')
	const mintBInputProps = usePoolAmount('mintBAmount', 'Mint B Amount')

	const { imageProps: mintBLogoProps } = useSelected('mintB', items)
	const { image: mintALogo } = useImage()

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
					<fieldset className="grid grid-cols-1 gap-2 p-2 w-fit">
						<Field inputProps={{ ...mintAInputProps }} logoProps={mintALogo} />
						<Field
							inputProps={{ ...mintBInputProps }}
							logoProps={mintBLogoProps}
						/>
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
	logoProps?: ImageProps
	inputProps: InputProps
}) {
	return (
		<div className="relative flex items-center h-auto">
			{logoProps ? (
				<TokenLogo className="absolute left-2" {...logoProps} />
			) : (
				<div className="absolute left-2 shrink-0 flex items-center overflow-hidden h-5 w-5 rounded-full pr-1 border border-gray-600" />
			)}
			<Input {...inputProps} />
		</div>
	)
}
