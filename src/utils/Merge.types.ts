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
type Merge<TObjectA, TObjectB> = {
  [K in keyof TObjectA | keyof TObjectB]: K extends keyof TObjectA &
    keyof TObjectB
    ? TObjectA[K] | TObjectB[K]
    : K extends keyof TObjectB
      ? TObjectB[K]
      : K extends keyof TObjectA
        ? TObjectA[K]
        : never;
};

export default Merge;
