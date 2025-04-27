/**
 * Converts a union type into an intersection type.
 *
 * This utility type takes a union `TUnion` and transforms it into an intersection
 * of all the types within the union. It works by leveraging conditional types
 * and function inference in TypeScript.
 *
 * @template TUnion - The union type to be converted into an intersection.
 *
 * @example
 * type Union = { a: string } | { b: number };
 * type Intersection = UnionToIntersection<Union>;
 * // Result: { a: string } & { b: number }
 */
type UnionToIntersection<TUnion> = (
  TUnion extends any ? (k: TUnion) => void : never
) extends (k: infer TIntersection) => void
  ? TIntersection
  : never;

type UnionToTuple<TUnion> =
  UnionToIntersection<
    TUnion extends any ? (u: TUnion) => void : never
  > extends (v: infer V) => void
    ? [...UnionToTuple<Exclude<TUnion, V>>, V]
    : [];

export default UnionToTuple;
