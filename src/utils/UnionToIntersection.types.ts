/**
 * Converts a union type into an intersection type.
 *
 * This utility type takes a union type `TUnion` and transforms it into an intersection
 * of all the types within the union. It leverages TypeScript's conditional types
 * and inference capabilities to achieve this transformation.
 *
 * @template TUnion - The union type to be converted into an intersection.
 *
 * @example
 * type Union = { a: string } | { b: number };
 * type Intersection = UnionToIntersection<Union>;
 * // Result: { a: string } & { b: number }
 */
type UnionToIntersection<TUnion> = (
  TUnion extends unknown ? (distributedUnion: TUnion) => void : never
) extends (mergedIntersection: infer TIntersection) => void
  ? TIntersection & TUnion
  : never;

export default UnionToIntersection;
