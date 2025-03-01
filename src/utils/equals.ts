export function strict(a: unknown, b: unknown): boolean {
  return equal(a, b, 0);
}

export function shallow(a: unknown, b: unknown, level = 1): boolean {
  return equal(a, b, level);
}

export function deep(a: unknown, b: unknown): boolean {
  return equal(a, b, undefined);
}

function equal(a: unknown, b: unknown, level: number | undefined): boolean {
  if (!!level && level < 0) return false;
  if (a === b) return true;
  if (!level) return false;

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
