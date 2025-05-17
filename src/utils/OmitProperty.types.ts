/**
 * Creates a new type by omitting properties with the specified name from the given type `TData`.
 *
 * @template TData - The source type from which to omit properties.
 * @template TPropertyName - The name of the property to omit (as a string literal type).
 * @template TRecursive - Determines how deeply to omit the property:
 *   - `"deep"` (default): Recursively omits the property from all nested objects and arrays.
 *   - `"shallow"`: Omits the property only from the top-level object and from elements of top-level arrays.
 *   - `"strict"`: Omits the property only from the top-level object, without recursion.
 *
 * - Functions are returned as-is.
 * - Arrays are handled according to the recursion mode.
 * - For objects, the property with the specified name is omitted according to the recursion mode.
 */
type OmitProperty<
  TData,
  TPropertyName extends string,
  TRecursive extends "deep" | "shallow" | "strict" = "deep",
> = TData extends Function
  ? TData
  : TData extends Array<infer TArrayElement>
    ? TRecursive extends "deep"
      ? Array<OmitProperty<TArrayElement, TPropertyName, TRecursive>>
      : TRecursive extends "shallow"
        ? Array<OmitProperty<TArrayElement, TPropertyName, "strict">>
        : TData
    : TData extends Record<string, any>
      ? {
          [TProperty in keyof TData as TProperty extends TPropertyName
            ? never
            : TProperty]: TRecursive extends "deep"
            ? OmitProperty<TData[TProperty], TPropertyName, TRecursive>
            : TRecursive extends "shallow"
              ? OmitProperty<TData[TProperty], TPropertyName, "strict">
              : TData[TProperty];
        }
      : TData;

export default OmitProperty;
