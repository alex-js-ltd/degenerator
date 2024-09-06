import { getToken } from '@/app/data/get_token'
import { use } from 'react'

export default function Page({ params }: { params: { id: string } }) {
	const promise = getToken(params.id)
	const token = use(promise)
	console.log(token)
	return <div>mint: {params.id}</div>
}
