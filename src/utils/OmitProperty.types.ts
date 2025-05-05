/**
 * A utility type that recursively omits a specified property from a given data structure.
 *
 * This type works with objects, arrays, and nested structures, removing the specified property
 * from all levels of the hierarchy.
 *
 * @template TData - The type of the data structure to process.
 * @template TPropertyName - The name of the property to omit. Must be a string.
 *
 * @remarks
 * - If `TData` is an array, the type applies the omission to each element of the array.
 * - If `TData` is an object, the type removes the specified property and recursively applies
 *   the omission to all nested properties.
 * - If `TData` is neither an object nor an array, it is returned as-is.
 *
 * @example
 * ```typescript
 * type Example = {
 *   id: number;
 *   name: string;
 *   nested: {
 *     id: number;
 *     value: string;
 *   };
 * };
 *
 * type Result = OmitProperty<Example, 'id'>;
 * // Result:
 * // {
 * //   name: string;
 * //   nested: {
 * //     value: string;
 * //   };
 * // }
 * ```
 */
type OmitProperty<TData, TPropertyName extends string> = TData extends Function
  ? TData
  : TData extends Array<infer TArrayElement>
    ? Array<OmitProperty<TArrayElement, TPropertyName>>
    : TData extends Record<string, any>
      ? {
          [TProperty in keyof TData as TProperty extends TPropertyName
            ? never
            : TProperty]: OmitProperty<TData[TProperty], TPropertyName>;
        }
      : TData;

export default OmitProperty;
