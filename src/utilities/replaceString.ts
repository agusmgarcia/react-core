const searchValue = /\$\{(.+?)\}/g;
const multipleValues = /^(.+?)\:(.+?)\/(.+?)$/; // TODO: delete this regexp in the next major version.
const multipleValuesV3 = /^(.+?)\?(.+?)\:(.+?)$/;

type Replacements = Record<string, string | number | boolean | undefined>;

export default function replaceString(
  message: string,
  replacements?: Replacements,
): string;

export default function replaceString(
  message: string | undefined,
  replacements?: Replacements,
): string | undefined;

export default function replaceString(
  message: string | undefined,
  replacements?: Replacements,
): string | undefined {
  if (message === undefined) return undefined;

  return message.replace(searchValue, (original, key) => {
    // TODO: remove this piece of code in the next major version.
    if (multipleValues.test(key)) {
      const matches = multipleValues.exec(key);
      if (matches === null) return original;

      const replacer = replacements?.[matches[1]];
      if (typeof replacer === "number")
        return replacer === 1 ? matches[2] : matches[3];

      return original;
    }

    // TODO: replace this piece of code by:
    // const matches = multipleValues.exec(key);
    // if (matches !== null) {
    if (multipleValuesV3.test(key)) {
      const matches = multipleValues.exec(key);
      if (matches === null) return original;

      const replacer = replacements?.[matches[1]];
      if (typeof replacer !== "boolean") return original;

      return replacer ? matches[2] : matches[3];
    }

    const replacer = replacements?.[key];
    if (typeof replacer === "string") return replacer;
    if (typeof replacer === "number") return replacer.toString();
    if (typeof replacer === "boolean") return replacer.toString();

    return original;
  });
}
