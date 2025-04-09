import {
  type AddArgumentToObject,
  type AsyncFunc,
  type Func,
  type Merge,
  type OmitFuncs,
} from "#src/utils";

import { type CreateGlobalSliceTypes } from "../createGlobalSlice";

export type SliceOf<
  TName extends string,
  TData,
  TSelected extends object = {},
  TExtraMethods extends Record<string, Func<any, [...any[]]>> = {},
> = CreateGlobalSliceTypes.SliceOf<
  TName,
  Merge<
    {
      data: TData | undefined;
      error: unknown;
      loading: boolean;
      loadMore: AsyncFunc<void, [args?: Partial<TSelected>]>;
      reload: AsyncFunc<void, [args?: Partial<TSelected>]>;
    },
    TExtraMethods
  >
>;

export type ExtractNameOf<TSlice extends SliceOf<any, any, any, any>> =
  CreateGlobalSliceTypes.ExtractNameOf<TSlice>;

export type ExtractDataOf<TSlice extends SliceOf<any, any, any, any>> =
  CreateGlobalSliceTypes.ExtractStateOf<TSlice>["data"];

export type ExtractSelectedOf<TSlice extends SliceOf<any, any, any, any>> =
  TSlice extends SliceOf<any, any, infer TSelected, any> ? TSelected : never;

export type ExtractExtraMethodsOf<TSlice extends SliceOf<any, any, any, any>> =
  TSlice extends SliceOf<any, any, any, infer TExtraMethods>
    ? TExtraMethods
    : never;

export type Context<TSlice extends SliceOf<any, any>, TOtherSlices = {}> = {
  get: Func<OmitFuncs<TSlice & TOtherSlices>>;
  set: Func<void, [state: React.SetStateAction<ExtractDataOf<TSlice>>]>;
  signal: AbortSignal;
};

export type Subscribe<TSlice extends SliceOf<any, any>, TOtherSlices> = (
  listener: Func<void, [context: Context<TSlice, TOtherSlices>]>,
  selector?: Func<any, [state: OmitFuncs<TOtherSlices>]>,
) => Func;

export type Input<TSlice extends SliceOf<any, any, any, any>, TOtherSlices> = [
  name: ExtractNameOf<TSlice>,
  fetcher: AsyncFunc<
    ExtractDataOf<TSlice>,
    [
      args: ExtractSelectedOf<TSlice>,
      signal: AbortSignal,
      prevData: ExtractDataOf<TSlice>,
    ]
  >,
  selector?: Func<ExtractSelectedOf<TSlice>, [state: OmitFuncs<TOtherSlices>]>,
  factory?: Func<
    AddArgumentToObject<
      ExtractExtraMethodsOf<TSlice>,
      Context<TSlice, TOtherSlices>
    >,
    [subscribe: Subscribe<TSlice, TOtherSlices>]
  >,
];

export type Output<
  TSlice extends SliceOf<any, any, any, any>,
  TOtherSlices,
> = CreateGlobalSliceTypes.Output<TSlice, TOtherSlices, ExtractDataOf<TSlice>>;
