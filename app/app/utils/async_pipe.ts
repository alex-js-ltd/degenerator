// Overload 1: One argument
export function asyncPipe<T, R>(
	fn1: (arg: T) => Promise<R> | R,
): (arg: T) => Promise<R>

// Overload 2: Two arguments
export function asyncPipe<T1, T2, R>(
	fn1: (arg: T1) => Promise<T2> | T2,
	fn2: (arg: T2) => Promise<R> | R,
): (arg: T1) => Promise<R>

// Overload 3: Three arguments
export function asyncPipe<T1, T2, T3, R>(
	fn1: (arg: T1) => Promise<T2> | T2,
	fn2: (arg: T2) => Promise<T3> | T3,
	fn3: (arg: T3) => Promise<R> | R,
): (arg: T1) => Promise<R>

// Overload 4: Three arguments
export function asyncPipe<T1, T2, T3, T4, R>(
	fn1: (arg: T1) => Promise<T2> | T2,
	fn2: (arg: T2) => Promise<T3> | T3,
	fn3: (arg: T3) => Promise<T4> | T4,
	fn4: (arg: T4) => Promise<R> | R,
): (arg: T1) => Promise<R>

// Implementation of asyncPipe
export function asyncPipe(...fns: Function[]) {
	return async (initialValue: unknown) => {
		return fns.reduce(async (acc, fn) => {
			const res = await acc
			return fn(res)
		}, initialValue)
	}
}
