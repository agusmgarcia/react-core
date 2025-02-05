import { type AsyncFunc, type Func, type OmitFuncs } from "#src/utilities";

import { type CreateGlobalSliceTypes } from "../createGlobalSlice";

export type SliceOf<
  TName extends string,
  TData,
  TSelected extends object = {},
> = CreateGlobalSliceTypes.SliceOf<
  TName,
  {
    data: TData | undefined;
    error: unknown;
    loading: boolean;
    reload: AsyncFunc<void, [args?: Partial<TSelected>]>;
  }
>;

export type ExtractNameOf<TSlice extends SliceOf<any, any, any>> =
  CreateGlobalSliceTypes.ExtractNameOf<TSlice>;

export type ExtractDataOf<TSlice extends SliceOf<any, any, any>> =
  CreateGlobalSliceTypes.ExtractStateOf<TSlice>["data"];

export type ExtractSelectedOf<TSlice extends SliceOf<any, any, any>> =
  TSlice extends SliceOf<any, any, infer TSelected> ? TSelected : never;

export type Input<TSlice extends SliceOf<any, any, any>, TOtherSlices> = [
  name: ExtractNameOf<TSlice>,
  fetcher: AsyncFunc<
    ExtractDataOf<TSlice>,
    [args: ExtractSelectedOf<TSlice>, signal: AbortSignal]
  >,
  selector?: Func<ExtractSelectedOf<TSlice>, [state: OmitFuncs<TOtherSlices>]>,
];

export type Output<
  TSlice extends SliceOf<any, any, any>,
  TOtherSlices,
> = CreateGlobalSliceTypes.Output<TSlice, TOtherSlices>;
