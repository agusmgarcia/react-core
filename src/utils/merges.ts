import * as filters from "./filters";

export function strict(target: unknown, source: unknown): any {
  return merge(target, source, 0, false, false, false);
}

export function shallow(
  target: unknown,
  source: unknown,
  options:
    | number
    | {
        arrayConcat?: boolean;
        arrayRemoveDuplicated?: boolean;
        level?: number;
        sort?: boolean;
      } = 1,
): any {
  return merge(
    target,
    source,
    typeof options === "number"
      ? options
      : typeof options.level === "number"
        ? options.level
        : 1,
    typeof options === "number" ? false : !!options.sort,
    typeof options === "number" ? false : !!options.arrayConcat,
    typeof options === "number" ? false : !!options.arrayRemoveDuplicated,
  );
}

export function deep(
  target: unknown,
  source: unknown,
  options?: {
    arrayConcat?: boolean;
    arrayRemoveDuplicated?: boolean;
    sort?: boolean;
  },
): any {
  return merge(
    target,
    source,
    undefined,
    !!options?.sort,
    !!options?.arrayConcat,
    !!options?.arrayRemoveDuplicated,
  );
}

function merge(
  target: unknown,
  source: unknown,
  level: number | undefined,
  sort: boolean,
  arrayConcat: boolean,
  arrayRemoveDuplicated: boolean,
): any {
  if (!!level && level < 0) return source;
  if (target === source) return source;
  if (typeof level === "number" && !level) return source;

  if (Array.isArray(target)) {
    if (!Array.isArray(source)) return source;

    let result: any[];

    if (arrayConcat) result = [...target, ...source];
    else {
      const length = Math.max(target.length, source.length);
      result = new Array(length);

      for (let i = 0; i < length; i++)
        result[i] =
          i < source.length && i < target.length
            ? merge(
                target[i],
                source[i],
                !!level ? level - 1 : undefined,
                sort,
                arrayConcat,
                arrayRemoveDuplicated,
              )
            : i < source.length
              ? source[i]
              : target[i];
    }

    return result
      .sort(!sort ? () => 0 : undefined)
      .filter(!arrayRemoveDuplicated ? () => true : filters.distinct("deep"));
  }

  if (typeof target === "object" && !!target) {
    if (Array.isArray(source)) return source;
    if (typeof source !== "object" || !source) return source;

    const keys = [...Object.keys(target), ...Object.keys(source)]
      .sort(!sort ? () => 0 : undefined)
      .filter(filters.distinct);

    const result: Record<string, any> = {};

    for (const key of keys) {
      result[key] =
        key in source && key in target
          ? merge(
              target[key as keyof typeof target],
              source[key as keyof typeof source],
              !!level ? level - 1 : undefined,
              sort,
              arrayConcat,
              arrayRemoveDuplicated,
            )
          : key in source
            ? source[key as keyof typeof source]
            : target[key as keyof typeof target];
    }

    return result;
  }

  return source;
}
