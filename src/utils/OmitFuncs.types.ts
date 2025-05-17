/**
 * Omits function properties from a given type `TData`.
 *
 * @template TData - The type to process.
 * @template TRecursive - Determines how deeply to omit function properties.
 *   - `"deep"` (default): Recursively omits function properties from all nested objects and arrays.
 *   - `"shallow"`: Omits function properties only from the top-level object, but processes array elements strictly.
 *   - `"strict"`: Omits function properties only from the top-level object, does not recurse into nested objects or arrays.
 *
 * - If `TData` is a function, it is returned as-is.
 * - If `TData` is an array, applies the omission recursively or strictly based on `TRecursive`.
 * - If `TData` is an object, omits properties whose values are functions, recursively or strictly based on `TRecursive`.
 * - Otherwise, returns `TData` as-is.
 */
type OmitFuncs<
  TData,
  TRecursive extends "deep" | "shallow" | "strict" = "deep",
> = TData extends Function
  ? TData
  : TData extends Array<infer TArrayElement>
    ? TRecursive extends "deep"
      ? Array<OmitFuncs<TArrayElement, TRecursive>>
      : TRecursive extends "shallow"
        ? Array<OmitFuncs<TArrayElement, "strict">>
        : TData
    : TData extends Record<string, any>
      ? {
          [TProperty in keyof TData as TData[TProperty] extends Function
            ? never
            : TProperty]: TRecursive extends "deep"
            ? OmitFuncs<TData[TProperty], TRecursive>
            : TRecursive extends "shallow"
              ? OmitFuncs<TData[TProperty], "strict">
              : TData[TProperty];
        }
      : TData;

export default OmitFuncs;
