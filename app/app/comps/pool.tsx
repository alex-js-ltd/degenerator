'use client'

import { type ReactElement } from 'react'
import { type SelectItemConfig } from '@/app/comps/select'
import { Popover, Content } from '@/app/comps/popover'
import { Button } from '@/app/comps/button'
import { Input, type InputProps } from '@/app/comps/input'
import { Icon } from '@/app/comps/_icon'
import { TokenLogo } from '@/app/comps/token_logo'
import { useSelectedItem } from '@/app/hooks/use_selected_item'
import { useControlInput } from '@/app/hooks/use_control_input'
import { useImage } from '@/app/context/image_context'
import { useMintList } from '@/app/hooks/use_mint_list'

export function Pool({ items }: { items: SelectItemConfig[] }) {
	const mintAInputProps = useControlInput('mintAAmount', {
		placeholder: 'Mint A Amount',
		variant: 'pool',
	})
	const mintBInputProps = useControlInput('mintBAmount', {
		placeholder: 'Mint B Amount',
		variant: 'pool',
	})

	const { image: mintALogoProps } = useImage()
	const mintList = useMintList({ items })
	const { imageProps: mintBLogoProps } = useSelectedItem('mintB', mintList)

	const mintALogo = mintALogoProps ? <TokenLogo {...mintALogoProps} /> : <>🤔</>
	const mintBLogo = mintBLogoProps ? <TokenLogo {...mintBLogoProps} /> : <>🌿</>

	return (
		<Popover
			content={
				<Content
					side="bottom"
					align="start"
					alignOffset={0}
					sideOffset={18}
					className="w-full h-auto z-20 overflow-hidden rounded-lg border-gray-800 bg-gray-900 p-0 data-[state=open]:animate-scale-in-95 data-[state=closed]:animate-scale-out-95"
				>
					<fieldset className="grid grid-cols-1 gap-2 p-2 w-fit">
						<Field inputProps={{ ...mintAInputProps }} logo={mintALogo} />
						<Field inputProps={{ ...mintBInputProps }} logo={mintBLogo} />
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
