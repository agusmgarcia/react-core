import type AsyncFunc from "./AsyncFunc.types";

/**
 * Aggregates paginated responses into a single array of items.
 *
 * Calls the provided asynchronous callback function to fetch all pages of data,
 * starting from the first page, and concatenates the `items` arrays from each page.
 *
 * @template TResult - The result type, which must include an `items` array and a `totalCount` number.
 * @param callback - An async function that fetches a page of results, given a page index and page size.
 * @param pageSize - The number of items per page to request from the callback.
 * @returns A promise that resolves to an array containing all items from all pages.
 */
export default async function aggregateResponse<
  TResult extends { items: any[]; totalCount: number },
>(
  callback: AsyncFunc<TResult, [pageIndex: number, pageSize: number]>,
  pageSize: number,
): Promise<TResult["items"]> {
  const { items, totalCount } = await callback(1, pageSize);

  const pagesCount = Math.ceil(totalCount / pageSize);
  if (pagesCount <= 1) return items;

  return await Promise.all(
    new Array(pagesCount - 1)
      .fill(0)
      .map((_, i) => i + 2)
      .map((pageIndex) => callback(pageIndex, pageSize))
      .map((result) => result.then((result) => result.items)),
  )
    .then((aggregatedItems) => aggregatedItems.flatMap((items) => items))
    .then((allItems) => items.concat(...allItems));
}
