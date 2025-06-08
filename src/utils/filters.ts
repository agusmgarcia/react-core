import * as equals from "./equals";
import type Func from "./Func.types";

/**
 * Filters elements by checking if the element's index matches its first occurrence in the array.
 *
 * @template TElement - The type of elements in the array.
 *
 * @param element - The element to check for distinctness.
 * @param index - The index of the element in the array.
 * @param array - The array being filtered.
 * @returns `true` if the element is distinct, otherwise `false`.
 */
export function distinct<TElement>(
  element: TElement,
  index: number,
  array: TElement[],
): boolean;

/**
 * Creates a function to filter elements by checking if the element's index matches its first occurrence in the array.
 *
 * @template TElement - The type of elements in the array.
 *
 * @param compare - A comparison function.
 * @returns A function that determines if an element is distinct based on the specified comparison method.
 */
export function distinct<TElement>(
  compare: Func<boolean, [element1: TElement, element2: TElement]>,
): Func<boolean, [element: TElement, index: number, array: TElement[]]>;

// TODO: delete this method.
/**
 * @deprecated This method is going to be removed in the next major version.
 */
export function distinct<TElement>(
  compare: "deep" | "shallow" | "strict",
): Func<boolean, [element: TElement, index: number, array: TElement[]]>;

export function distinct<TElement>(
  elementOrCompare:
    | TElement
    | Func<boolean, [element1: TElement, element2: TElement]>,
  index?: number,
  array?: TElement[],
):
  | boolean
  | Func<boolean, [element: TElement, index: number, array: TElement[]]> {
  if (typeof index === "number" && !!array)
    return array.indexOf(elementOrCompare as TElement) === index;

  return (element1, index, array) =>
    array.findIndex(
      (element2) =>
        element1 === element2 ||
        (elementOrCompare === "deep"
          ? equals.deep(element1, element2)
          : elementOrCompare === "shallow"
            ? equals.shallow(element1, element2)
            : elementOrCompare === "strict"
              ? equals.strict(element1, element2)
              : typeof elementOrCompare === "function"
                ? (elementOrCompare as Function)(element1, element2)
                : false),
    ) === index;
}

/**
 * Creates a function to paginate an array by filtering elements based on the specified page index and size.
 *
 * @template TElement - The type of elements in the array.
 *
 * @param pageIndex - The 1-based index of the page to retrieve.
 * @param pageSize - The number of elements per page.
 * @returns A function that determines if an element belongs to the specified page.
 */
export function paginate<TElement>(
  pageIndex: number,
  pageSize: number,
): Func<boolean, [element: TElement, index: number, array: TElement[]]> {
  return (_element, index, _array) =>
    index >= pageSize * (pageIndex - 1) && index < pageSize * pageIndex;
}
