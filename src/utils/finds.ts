/**
 * Determines if the current element is the first element in the array.
 *
 * @template TElement - The type of elements in the array.
 * @param _element - The current element being processed in the array.
 * @param index - The index of the current element in the array.
 * @param _array - The array being processed.
 * @returns `true` if the current element is the first element in the array; otherwise, `false`.
 */

export function first<TElement>(
  _element: TElement,
  index: number,
  _array: TElement[],
): boolean {
  return !index;
}

/**
 * Determines if the current element is the single element in the array.
 * Throws an error if the array contains more than one element.
 *
 * @template TElement - The type of elements in the array.
 * @param _element - The current element being processed in the array.
 * @param index - The index of the current element in the array.
 * @param array - The array being processed.
 * @throws {Error} If the array contains more than one element.
 * @returns `true` if the current element is the single element in the array; otherwise, `false`.
 */
export function single<TElement>(
  _element: TElement,
  index: number,
  array: TElement[],
): boolean {
  if (array.length > 1)
    throw new Error("There are more than one element in the array");

  return !index;
}

/**
 * Determines if the current element is the single element in the array or the default element.
 * Returns `false` if the array contains more than one element.
 *
 * @template TElement - The type of elements in the array.
 * @param _element - The current element being processed in the array.
 * @param index - The index of the current element in the array.
 * @param array - The array being processed.
 * @returns `true` if the current element is the single element or the default element in the array; otherwise, `false`.
 */
export function singleOrDefault<TElement>(
  _element: TElement,
  index: number,
  array: TElement[],
): boolean {
  if (array.length > 1) return false;
  return !index;
}
