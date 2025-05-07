/**
 * A utility type that recursively adds an additional argument to all function types
 * within an object type. If a property of the object is itself an object, the type
 * is applied recursively to its properties.
 *
 * @template TObject - The object type to which the additional argument will be added.
 * @template TParameter - The type of the additional argument to be added to the functions.
 *
 * @remarks
 * - If a property of `TObject` is a function type, the additional argument `TParameter`
 *   is appended to the function's argument list.
 * - If a property of `TObject` is an object, the type is applied recursively to its properties.
 * - Non-object and non-function properties remain unchanged.
 *
 * @example
 * ```typescript
 * type Original = {
 *   a: (x: number) => string;
 *   b: {
 *     c: (y: boolean) => number;
 *   };
 * };
 *
 * type Modified = AddArgumentToObject<Original, Date>;
 * // Result:
 * // {
 * //   a: (x: number, parameter: Date) => string;
 * //   b: {
 * //     c: (y: boolean, parameter: Date) => number;
 * //   };
 * // }
 * ```
 */
type AddArgumentToObject<TObject, TParameter> = TObject extends (
  ...args: any
) => any
  ? (...args: [...Parameters<TObject>, TParameter]) => ReturnType<TObject>
  : TObject extends Array<infer TArrayElement>
    ? Array<AddArgumentToObject<TArrayElement, TParameter>>
    : TObject extends Record<string, any>
      ? {
          [TProperty in keyof TObject]: TObject[TProperty] extends (
            ...args: any
          ) => any
            ? (
                ...args: [...Parameters<TObject[TProperty]>, TParameter]
              ) => ReturnType<TObject[TProperty]>
            : AddArgumentToObject<TObject[TProperty], TParameter>;
        }
      : TObject;

export default AddArgumentToObject;
