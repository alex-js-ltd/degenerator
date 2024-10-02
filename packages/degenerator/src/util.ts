import { PublicKey } from '@solana/web3.js'

export function sortTokens(
	tokenArray: Array<{ mint: PublicKey; program: PublicKey }>,
) {
	return [...tokenArray].sort((x, y) => {
		if (x.mint < y.mint) {
			return -1
		}
		if (x.mint > y.mint) {
			return 1
		}
		return 0
	})
}
