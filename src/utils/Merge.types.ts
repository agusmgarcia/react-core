/**
 * A utility type that merges two object types, `TObjectA` and `TObjectB`.
 *
 * - For keys that exist in both `TObjectA` and `TObjectB`, the resulting type will have the union of their values.
 * - For keys that exist only in `TObjectB`, the resulting type will use the value type from `TObjectB`.
 * - For keys that exist only in `TObjectA`, the resulting type will use the value type from `TObjectA`.
 *
 * @template TObjectA - The first object type to merge.
 * @template TObjectB - The second object type to merge.
 */
type Merge<
  TObjectA extends object,
  TObjectB extends object,
  I = Diff<TObjectA, TObjectB> &
    Intersection<TObjectB, TObjectA> &
    Diff<TObjectB, TObjectA>,
> = Pick<I, keyof I>;

type Diff<T extends object, U extends object> = Pick<
  T,
  SetDifference<keyof T, keyof U>
>;

type SetDifference<A, B> = A extends B ? never : A;

type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>;

export default Merge;
