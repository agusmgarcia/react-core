export function first<TElement>(
  _element: TElement,
  index: number,
  _array: TElement[],
): boolean {
  return !index;
}

export function single<TElement>(
  _element: TElement,
  index: number,
  array: TElement[],
): boolean {
  if (array.length > 1)
    throw new Error("There are more than one element in the array");

  return !index;
}

export function singleOrDefault<TElement>(
  _element: TElement,
  index: number,
  array: TElement[],
): boolean {
  if (array.length > 1) return false;
  return !index;
}
