import * as equals from "./equals";
import * as filters from "./filters";
import type Func from "./Func.types";
import * as sorts from "./sorts";

/**
 * Merges two objects or arrays strictly, ensuring deep equality checks.
 *
 * @param base - The base object or array to merge into.
 * @param next - The next object or array to merge from.
 * @returns The merged result.
 */
export function strict(base: unknown, next: unknown): any {
  return merge(base, next, 0, defaultSort, equals.deep);
}

/**
 * Merges two objects or arrays shallowly, with configurable options.
 *
 * @param base - The base object or array to merge into.
 * @param next - The next object or array to merge from.
 * @param options - The merge options, which can be:
 *   - A number representing the depth level for merging.
 *   - An object with optional properties:
 *     - `array.comparator`: A custom comparator function for arrays.
 *     - `level`: The depth level for merging.
 *     - `sort`: A custom sorting function.
 * @returns The merged result.
 */
export function shallow(
  base: unknown,
  next: unknown,
  options:
    | number
    | {
        array?: { comparator?: ArrayComparatorFn };
        level?: number;
        sort?: SortFn | boolean;
      } = 1,
): any {
  return merge(
    base,
    next,
    typeof options === "number"
      ? options
      : typeof options.level === "number"
        ? options.level
        : 1,
    typeof options === "number"
      ? defaultUnSort
      : typeof options.sort === "undefined"
        ? defaultUnSort
        : typeof options.sort === "boolean"
          ? options.sort
            ? defaultSort
            : defaultUnSort
          : options.sort,
    typeof options === "number"
      ? equals.deep
      : options.array?.comparator || equals.deep,
  );
}

/**
 * Merges two objects or arrays deeply, with configurable options.
 *
 * @param base - The base object or array to merge into.
 * @param next - The next object or array to merge from.
 * @param options - Optional merge options:
 *   - `array.comparator`: A custom comparator function for arrays.
 *   - `sort`: A custom sorting function.
 * @returns The merged result.
 */
export function deep(
  base: unknown,
  next: unknown,
  options?: {
    array?: { comparator?: ArrayComparatorFn };
    sort?: SortFn | boolean;
  },
): any {
  return merge(
    base,
    next,
    undefined,
    typeof options?.sort === "undefined"
      ? defaultUnSort
      : typeof options.sort === "boolean"
        ? options.sort
          ? defaultSort
          : defaultUnSort
        : options.sort,
    options?.array?.comparator || equals.deep,
  );
}

function merge(
  base: any,
  next: any,
  level: number | undefined,
  sort: SortFn,
  arrayComparator: ArrayComparatorFn,
): any {
  if (!!level && level < 0) return next;
  if (typeof level === "number" && !level) return next;
  if (base === next) return next;

  const followingLevel = !!level ? level - 1 : undefined;

  if (Array.isArray(next)) {
    if (!Array.isArray(base)) base = [];

    return [...base, ...next]
      .sort(sort)
      .filter(filters.distinct(arrayComparator))
      .map((baseValue) => {
        const index = next.findIndex((nextValue) =>
          arrayComparator(baseValue, nextValue),
        );

        return index !== -1
          ? merge(baseValue, next[index], followingLevel, sort, arrayComparator)
          : merge(undefined, baseValue, followingLevel, sort, arrayComparator);
      });
  }

  if (typeof next === "object" && !!next) {
    if (Array.isArray(base) || typeof base !== "object" || !base) base = {};

    return [...Object.keys(base), ...Object.keys(next)]
      .sort(sort)
      .filter(filters.distinct)
      .reduce(
        (result, key) => {
          result[key] =
            key in next
              ? merge(
                  base[key],
                  next[key],
                  followingLevel,
                  sort,
                  arrayComparator,
                )
              : merge(
                  undefined,
                  base[key],
                  followingLevel,
                  sort,
                  arrayComparator,
                );

          return result;
        },
        {} as Record<string, any>,
      );
  }

  return next;
}

type SortFn = Func<number, [element1: any, element2: any]>;

function defaultUnSort(): number {
  return 0;
}

function defaultSort(element1: any, element2: any): number {
  if (typeof element1 !== typeof element2) return 0;

  switch (typeof element1) {
    case "number":
      return sorts.byNumberAsc(element1, element2 as number);

    case "boolean":
      return sorts.byBooleanAsc(element1, element2 as boolean);

    case "bigint":
    case "function":
    case "object":
    case "symbol":
    case "undefined":
      return 0;

    case "string":
      return sorts.byStringAsc(element1, element2 as string);
  }
}

type ArrayComparatorFn = Func<boolean, [element1: any, element2: any]>;
