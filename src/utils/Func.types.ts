/**
 * A generic type representing a function with a customizable return type and arguments.
 *
 * @typeParam TResult - The return type of the function. Defaults to `void`.
 * @typeParam TArgs - A tuple type representing the arguments of the function. Defaults to an empty tuple `[]`.
 */
type Func<TResult = void, TArgs extends any[] = []> = (
  ...args: TArgs
) => TResult;

export default Func;
