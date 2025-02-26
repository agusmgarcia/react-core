type UnionToIntersection<TUnion> = (
  TUnion extends unknown ? (distributedUnion: TUnion) => void : never
) extends (mergedIntersection: infer TIntersection) => void
  ? TIntersection & TUnion
  : never;

export default UnionToIntersection;
