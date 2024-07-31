import { useField } from '@conform-to/react'
import Decimal from 'decimal.js'

export function useInitialPrice(mintBSymbol?: string) {
	const [symbol] = useField<string>('symbol')
	const [mintAAmount] = useField<string>('mintAAmount')
	const [mintBAmount] = useField<string>('mintBAmount')

	const a = Number(mintAAmount.value)
	const b = Number(mintBAmount.value)

	const currentPrice =
		a && b ? new Decimal(a).div(b).toDecimalPlaces(6).toString() : ''

	return [currentPrice, mintBSymbol, symbol.value].every(Boolean)
		? `${currentPrice} ${mintBSymbol} / ${symbol.value}`
		: ''
}
