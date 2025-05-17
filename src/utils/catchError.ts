import type AsyncFunc from "./AsyncFunc.types";
import type Func from "./Func.types";

/**
 * Executes a synchronous function and catches any errors that occur.
 *
 * If the `callback` function throws an error the `catchCallback` function is called with the error.
 *
 * @typeParam TResult - The return type of the `callback` function.
 * @typeParam TResultCatch - The return type of the `catchCallback` function.
 *
 * @param callback - The function to execute.
 * @param catchCallback - The function to execute if an error is thrown. Receives the error as its argument.
 *
 * @returns The result of `callback`, or the result of `catchCallback` if an error occurs.
 */
export default function catchError<TResult, TResultCatch>(
  callback: Func<TResult>,
  catchCallback: Func<TResultCatch, [error: unknown]>,
): TResult | TResultCatch;

/**
 * Executes an asynchronous function and catches any errors that occur.
 *
 * If the `callback` function returns a rejected promise the `catchCallback` function is called with the error.
 *
 * @typeParam TResult - The return type of the `callback` function.
 * @typeParam TResultCatch - The return type of the `catchCallback` function.
 *
 * @param callback - The function to execute.
 * @param catchCallback - The function to execute if a promise is rejected. Receives the error as its argument.
 *
 * @returns The result of `callback`, or the result of `catchCallback` if an error occurs.
 */
export default function catchError<TResult, TResultCatch>(
  callback: AsyncFunc<TResult>,
  catchCallback: Func<TResultCatch, [error: unknown]>,
): Promise<TResult | TResultCatch>;

export default function catchError<TResult, TResultCatch>(
  callback: Func<TResult> | AsyncFunc<TResult>,
  catchCallback: Func<TResultCatch, [error: unknown]>,
): TResult | TResultCatch | Promise<TResult | TResultCatch> {
  try {
    const result = callback();
    if (!(result instanceof Promise)) return result;
    return result.catch(catchCallback);
  } catch (error) {
    return catchCallback(error);
  }
}
