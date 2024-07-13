import type { Reducer, Dispatch } from 'react'
import { useReducer, useCallback, useLayoutEffect, useRef } from 'react'
import { delay } from '@/app/utils/misc'

type AsyncState<DataType> =
	| {
			status: 'idle'
			data?: null
			error?: null
			promise?: null
	  }
	| {
			status: 'pending'
			data?: null
			error?: null
			promise: Promise<DataType>
	  }
	| {
			status: 'resolved'
			data: DataType
			error: null
			promise: null
	  }
	| {
			status: 'rejected'
			data: null
			error: unknown
			promise: null
	  }

type AsyncAction<DataType> =
	| { type: 'idle' }
	| { type: 'pending'; promise: Promise<DataType> }
	| { type: 'resolved'; data: DataType; promise: Promise<DataType> }
	| { type: 'rejected'; error: unknown; promise: Promise<DataType> }
	| { type: 'reset' }

const asyncReducer = <DataType>(
	state: AsyncState<DataType>,
	action: AsyncAction<DataType>,
): AsyncState<DataType> => {
	switch (action.type) {
		case 'pending': {
			return {
				status: 'pending',
				data: null,
				error: null,
				promise: action.promise,
			}
		}
		case 'resolved': {
			if (action.promise !== state.promise) return state
			return {
				status: 'resolved',
				data: action.data,
				error: null,
				promise: null,
			}
		}
		case 'rejected': {
			if (action.promise !== state.promise) return state
			return {
				status: 'rejected',
				data: null,
				error: action.error,
				promise: null,
			}
		}

		case 'reset': {
			if (state.status === 'pending') return state
			return {
				status: 'idle',
			}
		}

		default: {
			throw new Error(`Unhandled action type: ${action.type}`)
		}
	}
}

const useAsync = <DataType>() => {
	const [state, dispatch] = useReducer<
		Reducer<AsyncState<DataType>, AsyncAction<DataType>>
	>(asyncReducer, {
		status: 'idle',
		data: null,
		error: null,
	})

	const { data, error, status } = state

	const safeSetState = useSafeDispatch(dispatch)

	const run = useCallback(
		async (promise: Promise<DataType>): Promise<DataType | unknown> => {
			dispatch({ type: 'pending', promise })

			try {
				const data = await promise
				safeSetState({ type: 'resolved', data, promise })
				return data
			} catch (error) {
				console.log('error', error)
				safeSetState({ type: 'rejected', error, promise })
				return error
			}
		},
		[],
	)

	const reset = useCallback(async () => {
		await delay(20000)
		dispatch({ type: 'reset' })
	}, [])

	return {
		isIdle: status === 'idle',
		isLoading: status === 'pending',
		isError: status === 'rejected',
		isSuccess: status === 'resolved',

		error,
		status,
		data,
		run,
		reset,
	}
}

export { useAsync }

const useSafeDispatch = <Action>(dispatch: Dispatch<Action>) => {
	const mounted = useRef(false)

	useLayoutEffect(() => {
		mounted.current = true

		return () => {
			mounted.current = false
		}
	}, [])

	return useCallback(
		(...args: Parameters<Dispatch<Action>>) =>
			mounted.current ? dispatch(...args) : void 0,
		[dispatch],
	)
}
