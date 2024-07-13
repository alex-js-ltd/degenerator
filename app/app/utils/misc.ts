import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Does its best to get a string error message from an unknown error.
 */
export function getErrorMessage(error: unknown) {
	if (typeof error === 'string') return error
	if (
		error &&
		typeof error === 'object' &&
		'message' in error &&
		typeof error.message === 'string'
	) {
		return error.message
	}
	console.error('Unable to get error message for error', error)
	return 'Unexpected error... 😭🔫'
}

/**
 * Provide a condition and if that condition is falsey, this throws a 400
 * Response with the given message.
 *
 * inspired by invariant from 'tiny-invariant'
 *
 * @example
 * invariantResponse(typeof value === 'string', `value must be a string`)
 *
 * @param condition The condition to check
 * @param message The message to throw
 * @param responseInit Additional response init options if a response is thrown
 *
 * @throws {Response} if condition is falsey
 */
export function invariantResponse(
	condition: any,
	message?: string | (() => string),
	responseInit?: ResponseInit,
): asserts condition {
	if (!condition) {
		throw new Response(
			typeof message === 'function'
				? message()
				: message ||
				  'An invariant failed, please provide a message to explain why.',
			{ status: 400, ...responseInit },
		)
	}
}

export function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export function callAll<Args extends Array<unknown>>(
	...fns: Array<((...args: Args) => unknown) | undefined>
) {
	return (...args: Args) => fns.forEach(fn => fn?.(...args))
}

type Func<T extends any[], R> = (...a: T) => R

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for the
 * resulting composite function.
 *
 * @param funcs The functions to compose.
 * @returns A function obtained by composing the argument functions from right
 *   to left. For example, `compose(f, g, h)` is identical to doing
 *   `(...args) => f(g(h(...args)))`.
 */
export function compose(): <R>(a: R) => R

export function compose<F extends Function>(f: F): F

/* two functions */
export function compose<A, T extends any[], R>(
	f1: (a: A) => R,
	f2: Func<T, A>,
): Func<T, R>

/* three functions */
export function compose<A, B, T extends any[], R>(
	f1: (b: B) => R,
	f2: (a: A) => B,
	f3: Func<T, A>,
): Func<T, R>

/* four functions */
export function compose<A, B, C, T extends any[], R>(
	f1: (c: C) => R,
	f2: (b: B) => C,
	f3: (a: A) => B,
	f4: Func<T, A>,
): Func<T, R>

/* rest */
export function compose<R>(
	f1: (a: any) => R,
	...funcs: Function[]
): (...args: any[]) => R

export function compose<R>(...funcs: Function[]): (...args: any[]) => R

export function compose(...funcs: Function[]) {
	if (funcs.length === 0) {
		// infer the argument type so it is usable in inference down the line
		return <T>(arg: T) => arg
	}

	if (funcs.length === 1) {
		return funcs[0]
	}

	return funcs.reduce(
		(a, b) =>
			(...args: any) =>
				a(b(...args)),
	)
}
