import * as equals from "./equals";
import type Func from "./Func.types";

export function distinct<TElement>(
  element: TElement,
  index: number,
  array: TElement[],
): boolean;

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
    array.findIndex((element2) =>
      elementOrCompare === "deep"
        ? equals.deep(element1, element2)
        : elementOrCompare === "shallow"
          ? equals.shallow(element1, element2)
          : elementOrCompare === "strict"
            ? equals.strict(element1, element2)
            : elementOrCompare instanceof Function
              ? elementOrCompare(element1, element2)
              : false,
    ) === index;
}

export function paginate<TElement>(
  pageIndex: number,
  pageSize: number,
): Func<boolean, [element: TElement, index: number, array: TElement[]]> {
  return (_element, index, _array) =>
    index >= pageSize * (pageIndex - 1) && index < pageSize * pageIndex;
}
