/**
 * Converts a tuple type into a union type of its elements.
 *
 * @template TArray - The tuple type to be converted into a union.
 * @remarks
 * - If `TArray` is not an array type, the result will be `never`.
 * - If `TArray` is an array type, the resulting type will be a union of all its elements.
 *
 * @example
 * ```typescript
 * type MyTuple = [string, number, boolean];
 * type MyUnion = TupleToUnion<MyTuple>; // string | number | boolean
 * ```
 */
type TupleToUnion<TArray> = TArray extends unknown[] ? TArray[number] : never;

export default TupleToUnion;
