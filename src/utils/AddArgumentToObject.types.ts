/**
 * Adds an additional argument to all function properties within an object type.
 *
 * @template TData - The original object or value type.
 * @template TParameter - The type of the argument to add to each function.
 * @template TRecursive - Determines how deeply to apply the transformation:
 *   - `"deep"` (default): Recursively applies to all nested objects and arrays.
 *   - `"shallow"`: Applies only to the first level of properties.
 *   - `"strict"`: Applies only to direct function properties, leaving other properties unchanged.
 *
 * - If `TData` is a function, it is returned as-is.
 * - If `TData` is an array, the transformation is applied to its elements according to `TRecursive`.
 * - If `TData` is an object, each function property receives the new argument at the end of its parameter list.
 * - Non-object, non-function types are returned as-is.
 *
 * @example
 * type Original = {
 *   foo: (a: number) => string;
 *   bar: {
 *     baz: (b: boolean) => number;
 *   };
 * };
 * type WithExtraArg = AddArgumentToObject<Original, string>;
 * // Result:
 * // {
 * //   foo: (a: number, arg: string) => string;
 * //   bar: {
 * //     baz: (b: boolean, arg: string) => number;
 * //   };
 * // }
 */
type AddArgumentToObject<
  TData,
  TParameter,
  TRecursive extends "deep" | "shallow" | "strict" = "deep",
> = TData extends Function
  ? TData
  : TData extends Array<infer TArrayElement>
    ? TRecursive extends "deep"
      ? Array<AddArgumentToObject<TArrayElement, TParameter, TRecursive>>
      : TRecursive extends "shallow"
        ? Array<AddArgumentToObject<TArrayElement, TParameter, "strict">>
        : TData
    : TData extends Record<string, any>
      ? {
          [TProperty in keyof TData]: TData[TProperty] extends (
            ...args: any
          ) => any
            ? (
                ...args: [...Parameters<TData[TProperty]>, TParameter]
              ) => ReturnType<TData[TProperty]>
            : TRecursive extends "deep"
              ? AddArgumentToObject<TData[TProperty], TParameter, TRecursive>
              : TRecursive extends "shallow"
                ? AddArgumentToObject<TData[TProperty], TParameter, "strict">
                : TData[TProperty];
        }
      : TData;

export default AddArgumentToObject;
