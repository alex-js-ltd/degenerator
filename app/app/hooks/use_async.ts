import type { Reducer, Dispatch } from 'react'
import { useReducer, useCallback, useLayoutEffect, useRef } from 'react'

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
			error: Error
			promise: null
	  }

type AsyncAction<DataType> =
	| { type: 'reset' }
	| { type: 'pending'; promise: Promise<DataType> }
	| { type: 'resolved'; data: DataType; promise: Promise<DataType> }
	| { type: 'rejected'; error: Error; promise: Promise<DataType> }

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

	const run = useCallback((promise: Promise<DataType>): Promise<DataType> => {
		dispatch({ type: 'pending', promise })
		return promise.then(
			data => {
				safeSetState({ type: 'resolved', data, promise })
				return data
			},
			error => {
				safeSetState({ type: 'rejected', error, promise })
				return Promise.reject(error) // Propagate the error correctly
			},
		)
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
	}
}

export { useAsync }

const useSafeDispatch = <DataType>(
	dispatch: Dispatch<AsyncAction<DataType>>,
) => {
	const mounted = useRef(false)

	useLayoutEffect(() => {
		mounted.current = true

		return () => {
			mounted.current = false
		}
	}, [])

	return useCallback(
		(args: AsyncAction<DataType>) =>
			mounted.current ? dispatch(args) : void 0,
		[dispatch],
	)
}
