export function distinct<TElement>(
  element: TElement,
  index: number,
  array: TElement[],
): boolean {
  return array.indexOf(element) === index;
}
