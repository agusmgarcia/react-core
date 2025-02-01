import { type AsyncFunc, type Func, type OmitFuncs } from "#src/utilities";

import { type CreateGlobalSliceTypes } from "../createGlobalSlice";

type Pagination = { limit: number; page: number };

export type SliceOf<
  TName extends string,
  TData,
> = CreateGlobalSliceTypes.SliceOf<
  TName,
  {
    _pagination: Pagination;
    _selected: unknown;
    data: TData | undefined;
    error: unknown;
    loading: boolean;
    loadMore: AsyncFunc<void, [args?: { limit?: number }]>;
    reload: AsyncFunc<void, [args?: { limit?: number; page?: number }]>;
  }
>;

export type Options = { pagination: Pagination };

export type Input<
  TSlice extends SliceOf<any, any>,
  TOtherSlices,
  TSelected extends object,
> =
  | [
      name: keyof TSlice,
      fetcher: AsyncFunc<
        TSlice[keyof TSlice]["data"],
        [args: TSelected & Pagination, signal: AbortSignal]
      >,
      selector?: Func<TSelected, [state: OmitFuncs<TOtherSlices>]>,
    ]
  | [
      name: keyof TSlice,
      fetcher: AsyncFunc<
        TSlice[keyof TSlice]["data"],
        [args: TSelected & Pagination, signal: AbortSignal]
      >,
      options?: Partial<Options>,
      selector?: Func<TSelected, [state: OmitFuncs<TOtherSlices>]>,
    ];

export type Output<
  TSlice extends SliceOf<any, any>,
  TOtherSlices,
> = CreateGlobalSliceTypes.Output<TSlice, TOtherSlices>;
