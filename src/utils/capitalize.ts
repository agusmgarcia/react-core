/**
 * Capitalizes the first letter of a given string and returns the modified string.
 *
 * @template TString - A string type that represents the input string.
 * @param string - The input string to be capitalized.
 * @returns The input string with its first letter converted to uppercase.
 *
 * @example
 * ```typescript
 * const result = capitalize("hello");
 * console.log(result); // Output: "Hello"
 * ```
 */
export default function capitalize<TString extends string>(
  string: TString,
): Capitalize<TString> {
  return (string.charAt(0).toUpperCase() +
    string.slice(1)) as Capitalize<TString>;
}
