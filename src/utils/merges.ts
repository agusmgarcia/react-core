import { distinct } from "./filters";

export function strict(target: unknown, source: unknown): any {
  return merge(target, source, 0);
}

export function shallow(target: unknown, source: unknown, level = 1): any {
  return merge(target, source, level);
}

export function deep(target: unknown, source: unknown): any {
  return merge(target, source, undefined);
}

function merge(
  target: unknown,
  source: unknown,
  level: number | undefined,
): any {
  if (!!level && level < 0) return source;
  if (target === source) return source;
  if (typeof level === "number" && !level) return source;

  if (Array.isArray(target)) {
    if (!Array.isArray(source)) return source;

    const length = Math.max(target.length, source.length);
    const result = new Array(length);

    for (let i = 0; i < length; i++)
      result[i] =
        i < source.length && i < target.length
          ? merge(target[i], source[i], !!level ? level - 1 : undefined)
          : i < source.length
            ? source[i]
            : target[i];

    return result;
  }

  if (typeof target === "object" && !!target) {
    if (Array.isArray(source)) return source;
    if (typeof source !== "object" || !source) return source;

    const keys = [...Object.keys(target), ...Object.keys(source)].filter(
      distinct,
    );

    const result: Record<string, any> = {};

    for (const key of keys) {
      result[key] =
        key in source && key in target
          ? merge(
              target[key as keyof typeof target],
              source[key as keyof typeof source],
              !!level ? level - 1 : undefined,
            )
          : key in source
            ? source[key as keyof typeof source]
            : target[key as keyof typeof target];
    }

    return result;
  }

  return source;
}
