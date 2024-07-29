'use client'

import { type ReactElement } from 'react'
import { type SelectItemConfig } from '@/app/comps/select'
import { Popover, Content } from '@/app/comps/popover'
import { Button } from '@/app/comps/button'
import { Input, type InputProps } from '@/app/comps/input'
import { Icon } from '@/app/comps/_icon'
import { TokenLogo } from '@/app/comps/token_logo'
import { useSelected } from '@/app/hooks/use_selected'
import { usePoolAmount } from '@/app/hooks/use_pool_amount'
import { useImage } from '@/app/context/image_context'
import { cn } from '@/app/utils/misc'

export function Pool({ items }: { items: SelectItemConfig[] }) {
	const mintAInputProps = usePoolAmount('mintAAmount', 'Mint A Amount')
	const mintBInputProps = usePoolAmount('mintBAmount', 'Mint B Amount')

	const { image: mintALogoProps } = useImage()
	const { imageProps: mintBLogoProps } = useSelected('mintB', items)

	const mintALogo = mintALogoProps ? <TokenLogo {...mintALogoProps} /> : <>🤔</>
	const mintBLogo = mintBLogoProps ? <TokenLogo {...mintBLogoProps} /> : <>🌿</>

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
						<Field inputProps={{ ...mintAInputProps }} logo={mintALogo} />
						<Field inputProps={{ ...mintBInputProps }} logo={mintBLogo} />
					</fieldset>
				</Content>
			}
		>
			<Button
				variant="pool"
				className={cn(mintAInputProps.className, mintBInputProps.className)}
			>
				🏊‍♂️&nbsp;&nbsp;Pool
				<Icon className="size-[15px] ml-auto" name="arrow" />
			</Button>
		</Popover>
	)
}

function Field({
	logo,
	inputProps,
}: {
	logo?: ReactElement
	inputProps: InputProps
}) {
	return (
		<div className="relative flex items-center h-auto">
			<span className="absolute left-2">{logo}</span>
			<Input {...inputProps} />
		</div>
	)
}
