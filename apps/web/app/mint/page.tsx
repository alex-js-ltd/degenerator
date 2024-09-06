import { getMint } from '@/app/data/get_mint'

export default async function Page({ params }: { params: { id: string } }) {
	const mintAccount = await getMint(params.id)
	console.log(mintAccount)

	return <div>Mint: {params.id}</div>
}
