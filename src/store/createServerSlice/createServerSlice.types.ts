import {
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
      set: AsyncFunc<void, [data: React.SetStateAction<TData | undefined>]>;
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
    CreateGlobalSliceTypes.WithContext<
      CreateGlobalSliceTypes.SliceOf<
        ExtractNameOf<TSlice>,
        ExtractExtraMethodsOf<TSlice>
      >,
      TOtherSlices,
      TSlice
    >,
    [subscribe: CreateGlobalSliceTypes.Subscribe<TSlice, TOtherSlices>]
  >,
];

export type Output<
  TSlice extends SliceOf<any, any, any, any>,
  TOtherSlices,
> = CreateGlobalSliceTypes.Output<TSlice, TOtherSlices, ExtractDataOf<TSlice>>;
