import type Func from "./Func.types";

export function distinct<TElement>(
  element: TElement,
  index: number,
  array: TElement[],
): boolean {
  return array.indexOf(element) === index;
}

export function paginate<TElement>(
  pageIndex: number,
  pageSize: number,
): Func<boolean, [element: TElement, index: number, array: TElement[]]> {
  return (_element, index, _array) =>
    index >= pageSize * (pageIndex - 1) && index < pageSize * pageIndex;
}
