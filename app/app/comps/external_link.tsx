import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/utils/misc'

const externalLinkVariants = cva(undefined, {
	variants: {
		variant: {
			toast: 'flex text-toast-text text-sm',
			underline: 'underline',
		},
	},
})

export interface ExternalLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
		VariantProps<typeof externalLinkVariants> {}

const ExternalLink = React.forwardRef<HTMLAnchorElement, ExternalLinkProps>(
	({ className, variant, ...props }, ref) => {
		return (
			<a
				className={cn(externalLinkVariants({ variant, className }))}
				ref={ref}
				target="_blank"
				rel="noopener noreferrer"
				{...props}
			/>
		)
	},
)

ExternalLink.displayName = 'ExternalLink'

export { ExternalLink, externalLinkVariants }