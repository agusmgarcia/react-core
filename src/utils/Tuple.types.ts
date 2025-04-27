/**
 * A recursive utility type that generates a tuple of a specified length (`TLength`)
 * where each element is of the specified type (`TType`).
 *
 * @template TType - The type of each element in the resulting tuple.
 * @template TLength - The desired length of the tuple.
 * @template TRest - An internal accumulator used during recursion to build the tuple.
 *
 * @remarks
 * This type uses recursion to construct the tuple by repeatedly prepending `TType`
 * to the `TRest` array until the length of `TRest` matches `TLength`.
 *
 * @example
 * ```typescript
 * type TupleOfThreeStrings = _TupleOf<string, 3, []>;
 * // Result: [string, string, string]
 * ```
 */
type _TupleOf<
  TType,
  TLength extends number,
  TRest extends unknown[],
> = TRest["length"] extends TLength
  ? TRest
  : _TupleOf<TType, TLength, [TType, ...TRest]>;

type Tuple<TType, TLength extends number> = TLength extends TLength
  ? number extends TLength
    ? TType[]
    : _TupleOf<TType, TLength, []>
  : never;

export default Tuple;
