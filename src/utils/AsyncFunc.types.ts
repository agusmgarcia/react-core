/**
 * Represents an asynchronous function type.
 *
 * @template TResult - The type of the result returned by the Promise. Defaults to `void`.
 * @template TArgs - The tuple type of the arguments accepted by the function. Defaults to an empty tuple `[]`.
 *
 * @param {...TArgs} args - The arguments passed to the function.
 * @returns {Promise<TResult>} A Promise that resolves to a value of type `TResult`.
 */
type AsyncFunc<TResult = void, TArgs extends any[] = []> = (
  ...args: TArgs
) => Promise<TResult>;

export default AsyncFunc;
