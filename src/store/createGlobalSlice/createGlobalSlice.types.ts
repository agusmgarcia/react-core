import { type StateCreator } from "zustand";

import {
  type AddArgumentToObject,
  type Func,
  type OmitFuncs,
} from "#src/utils";

export type SliceOf<TName extends string, TState> = Record<TName, TState>;

export type ExtractNameOf<TSlice extends SliceOf<any, any>> =
  TSlice extends SliceOf<infer TName, any> ? TName : never;

export type ExtractStateOf<TSlice extends SliceOf<any, any>> =
  TSlice extends SliceOf<any, infer TState> ? TState : never;

export type Context<TSlice extends SliceOf<any, any>, TOtherSlices = {}> = {
  get: Func<OmitFuncs<TSlice & TOtherSlices>>;
  set: Func<
    void,
    [state: React.SetStateAction<OmitFuncs<ExtractStateOf<TSlice>>>]
  >;
  signal: AbortSignal;
};

export type Subscribe<TSlice extends SliceOf<any, any>, TOtherSlices> = (
  listener: Func<void, [context: Context<TSlice, TOtherSlices>]>,
  selector?: Func<any, [state: OmitFuncs<TOtherSlices>]>,
) => Func;

export type Input<TSlice extends SliceOf<any, any>, TOtherSlices> = [
  name: ExtractNameOf<TSlice>,
  sliceFactory: Func<
    AddArgumentToObject<ExtractStateOf<TSlice>, Context<TSlice, TOtherSlices>>,
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
