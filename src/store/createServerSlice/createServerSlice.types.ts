import { type AsyncFunc, type Func } from "#src/utilities";

import { type CreateGlobalSliceTypes } from "../createGlobalSlice";

export type SliceOf<
  TName extends string,
  TData,
> = CreateGlobalSliceTypes.SliceOf<
  TName,
  {
    data: TData | undefined;
    error: unknown;
    loading: boolean;
    reload: Func;
  }
>;

export type Input<TSlice extends SliceOf<any, any>, TOtherSlices, TSelected> = [
  name: keyof TSlice,
  fetcher: AsyncFunc<
    TSlice[keyof TSlice]["data"],
    [args: TSelected, signal: AbortSignal]
  >,
  selector?: Func<TSelected, [state: TOtherSlices]>,
];

export type Output<
  TSlice extends SliceOf<any, any>,
  TOtherSlices,
> = CreateGlobalSliceTypes.Output<TSlice, TOtherSlices>;
