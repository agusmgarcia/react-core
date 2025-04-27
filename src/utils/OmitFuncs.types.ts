/**
 * A utility type that recursively removes all function properties from a given type.
 *
 * @template TData - The type from which function properties will be omitted.
 *
 * @remarks
 * - If `TData` is an object, it recursively removes all properties that are functions.
 * - If `TData` is an array, it returns the array type as-is.
 * - If `TData` is a function, it returns the function type as-is.
 * - If `TData` is not an object, it returns the type as-is.
 *
 * @example
 * ```typescript
 * type Example = {
 *   a: string;
 *   b: () => void;
 *   c: {
 *     d: number;
 *     e: () => string;
 *   };
 * };
 *
 * type Result = OmitFuncs<Example>;
 * // Result is:
 * // {
 * //   a: string;
 * //   c: {
 * //     d: number;
 * //   };
 * // }
 * ```
 */
type OmitFuncs<TData> = TData extends object
  ? TData extends Array<any>
    ? TData
    : TData extends Function
      ? TData
      : {
          [TProperty in keyof TData as TData[TProperty] extends Function
            ? never
            : TProperty]: OmitFuncs<TData[TProperty]>;
        }
  : TData;

export default OmitFuncs;
