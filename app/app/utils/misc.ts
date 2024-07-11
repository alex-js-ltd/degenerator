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

// const asyncPipe =
//   (...functions) =>
//   (initialValue) =>
//     functions.reduce(async (acc, fn) => fn(await acc), initialValue);

function asyncPipe<Args extends Array<unknown>>(
	intialValue,
	...fns: Array<((...args: Args) => unknown) | undefined>
) {
	return fns.reduce((acc, fn) => {
		if (fn) return fn(acc)

		return acc
	}, intialValue)
}
