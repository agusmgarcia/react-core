/**
 * Performs a strict equality check between two values.
 * This function compares the values deeply with a recursion level of 0.
 *
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns `true` if the values are strictly equal, otherwise `false`.
 */
export function strict(a: unknown, b: unknown): boolean {
  return equal(a, b, 0);
}

/**
 * Performs a shallow equality check between two values.
 * This function compares the values with a recursion level of 1 by default.
 *
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @param level - The recursion depth for comparison. Defaults to 1.
 * @returns `true` if the values are shallowly equal, otherwise `false`.
 */
export function shallow(a: unknown, b: unknown, level = 1): boolean {
  return equal(a, b, level);
}

/**
 * Performs a deep equality check between two values.
 * This function compares the values deeply without any recursion depth limit.
 *
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns `true` if the values are deeply equal, otherwise `false`.
 */
export function deep(a: unknown, b: unknown): boolean {
  return equal(a, b, undefined);
}

function equal(a: unknown, b: unknown, level: number | undefined): boolean {
  if (!!level && level < 0) return false;
  if (a === b) return true;
  if (typeof level === "number" && !level) return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++)
      if (!equal(a[i], b[i], !!level ? level - 1 : undefined)) return false;

    return true;
  }

  if (typeof a === "object" && !!a) {
    if (Array.isArray(b)) return false;
    if (typeof b !== "object" || !b) return false;

    const keysOfA = Object.keys(a);
    const keysOfB = Object.keys(b);
    if (
      keysOfA.length !== keysOfB.length ||
      keysOfA.some((k1) => !keysOfB.includes(k1))
    )
      return false;

    for (let i = 0; i < keysOfA.length; i++)
      if (
        !equal(
          a[keysOfA[i] as keyof typeof a],
          b[keysOfA[i] as keyof typeof b],
          !!level ? level - 1 : undefined,
        )
      )
        return false;

    return true;
  }

  return false;
}
