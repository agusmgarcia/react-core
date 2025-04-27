/**
 * Replaces placeholders in a string with corresponding values from a replacements object.
 *
 * Placeholders in the string should be in the format `${key}`. Optionally, conditional placeholders
 * can be used in the format `${key?valueIfTrue:valueIfFalse}`. The conditional placeholders
 * evaluate based on whether the value of `key` in the replacements object is `1`.
 *
 * @param message - The string containing placeholders to be replaced. If undefined, the function
 *                  will return undefined.
 * @param replacements - An object containing key-value pairs where the key corresponds to the
 *                       placeholder name and the value is the replacement. The value can be of
 *                       type string, number, boolean, or undefined.
 * @returns The string with placeholders replaced by their corresponding values from the
 *          replacements object. If the input message is undefined, the function returns undefined.
 *
 * @example
 * ```typescript
 * const message = "Hello, ${name}! You have ${count} new messages.";
 * const replacements = { name: "Alice", count: 5 };
 * const result = replaceString(message, replacements);
 * console.log(result); // "Hello, Alice! You have 5 new messages."
 * ```
 *
 * @example
 * ```typescript
 * const message = "Your subscription is ${status?active:inactive}.";
 * const replacements = { status: 1 };
 * const result = replaceString(message, replacements);
 * console.log(result); // "Your subscription is active."
 * ```
 */
const searchValue = /\$\{(.+?)\}/g;
const multipleValues = /^(.+?)\?(.+?)\:(.+?)$/;

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
  if (!message) return undefined;

  return message.replace(searchValue, (original, key) => {
    if (multipleValues.test(key)) {
      const matches = multipleValues.exec(key);
      if (!matches) return original;

      const replacer = replacements?.[matches[1]];
      if (typeof replacer !== "number") return original;

      return replacer === 1 ? matches[2] : matches[3];
    }

    const replacer = replacements?.[key];

    if (typeof replacer === "string") return replacer;
    if (typeof replacer === "number") return replacer.toString();
    if (typeof replacer === "boolean") return replacer.toString();

    return original;
  });
}
