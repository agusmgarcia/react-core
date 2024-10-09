export function first<TElement>(
  _element: TElement,
  index: number,
  array: TElement[],
): boolean {
  if (array.length === 0)
    throw new Error("There are not elements in the array");

  return index === 0;
}

export function firstOrDefault<TElement>(
  _element: TElement,
  index: number,
  _array: TElement[],
): boolean {
  return index === 0;
}

export function single<TElement>(
  _element: TElement,
  index: number,
  array: TElement[],
): boolean {
  if (array.length !== 1)
    throw new Error("There are more than one element in the array");

  return index === 0;
}

export function singleOrDefault<TElement>(
  _element: TElement,
  index: number,
  array: TElement[],
): boolean {
  return array.length === 1 ? index === 0 : false;
}
