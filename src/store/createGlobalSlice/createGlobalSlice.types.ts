import { type StateCreator } from "zustand";

import { type Func, type OmitFuncs } from "#src/utils";

export type SliceOf<TName extends string, TState> = Record<TName, TState>;

export type ExtractNameOf<TSlice extends SliceOf<any, any>> =
  TSlice extends SliceOf<infer TName, any> ? TName : never;

export type ExtractStateOf<TSlice extends SliceOf<any, any>> =
  TSlice extends SliceOf<any, infer TState> ? TState : never;

export type Context<TSlice extends SliceOf<any, any>, TOtherSlices = {}> = {
  get: Func<OmitFuncs<TSlice & TOtherSlices>>;
  set: Func<
    void,
    [
      state:
        | OmitFuncs<ExtractStateOf<TSlice>>
        | Func<
            OmitFuncs<ExtractStateOf<TSlice>>,
            [prevState: OmitFuncs<ExtractStateOf<TSlice>>]
          >,
    ]
  >;
  signal: AbortSignal;
};

export type WithContext<TSlice extends SliceOf<any, any>, TOtherSlices> =
  ExtractStateOf<TSlice> extends object
    ? {
        [TProperty in keyof ExtractStateOf<TSlice>]: ExtractStateOf<TSlice>[TProperty] extends Func<
          infer TResult,
          infer TArgs
        >
          ? Func<
              TResult,
              [...args: TArgs, context: Context<TSlice, TOtherSlices>]
            >
          : ExtractStateOf<TSlice>[TProperty];
      }
    : ExtractStateOf<TSlice>;

export type Subscribe<TSlice extends SliceOf<any, any>, TOtherSlices> = <
  TSelected,
>(
  listener: Func<
    void,
    [state: TSelected, context: Context<TSlice, TOtherSlices>]
  >,
  selector?: Func<TSelected, [state: OmitFuncs<TOtherSlices>]>,
) => Func;

export type Input<TSlice extends SliceOf<any, any>, TOtherSlices> = [
  name: ExtractNameOf<TSlice>,
  factory: Func<
    WithContext<TSlice, TOtherSlices>,
    [subscribe: Subscribe<TSlice, TOtherSlices>]
  >,
];

export type Output<
  TSlice extends SliceOf<any, any>,
  TOtherSlices,
  TInitialState,
> = Func<
  StateCreator<TSlice & TOtherSlices, [], [], TSlice>,
  [
    initialState:
      | Partial<Record<ExtractNameOf<TSlice>, OmitFuncs<TInitialState>>>
      | undefined,
  ]
>;
