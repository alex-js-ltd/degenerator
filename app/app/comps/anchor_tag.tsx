import * as React from 'react'
import { cn } from '@/app/utils/misc'

type AnchorTagProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

const AnchorTag = React.forwardRef<HTMLAnchorElement, AnchorTagProps>(
	({ className, type, ...props }, ref) => {
		return (
			<a
				{...props}
				className={cn(
					'text-teal-300 text-sm text-decoration-line: underline',
					className,
				)}
				ref={ref}
				target="_blank"
				rel="noopener noreferrer"
			/>
		)
	},
)

AnchorTag.displayName = 'AnchorTag'

export { AnchorTag }
