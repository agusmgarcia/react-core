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
