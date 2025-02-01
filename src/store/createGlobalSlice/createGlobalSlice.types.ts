import { type StateCreator } from "zustand";

import { type Func, type OmitFuncs } from "#src/utilities";

export type SliceOf<TName extends string, TState> = Record<TName, TState>;

export type Context<TSlice extends SliceOf<any, any>, TOtherSlices = {}> = {
  get: Func<OmitFuncs<TSlice & TOtherSlices>>;
  set: Func<
    void,
    [
      state:
        | OmitFuncs<TSlice[keyof TSlice]>
        | Func<
            OmitFuncs<TSlice[keyof TSlice]>,
            [prevState: OmitFuncs<TSlice[keyof TSlice]>]
          >,
    ]
  >;
  signal: AbortSignal;
};

type WithContext<
  TSlice extends SliceOf<any, any>,
  TOtherSlices,
> = TSlice[keyof TSlice] extends object
  ? {
      [TProperty in keyof TSlice[keyof TSlice]]: TSlice[keyof TSlice][TProperty] extends Func<
        infer TResult,
        infer TArgs
      >
        ? Func<
            TResult,
            [...args: TArgs, context: Context<TSlice, TOtherSlices>]
          >
        : TSlice[keyof TSlice][TProperty];
    }
  : TSlice[keyof TSlice];

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
  name: keyof TSlice,
  factory: Func<
    WithContext<TSlice, TOtherSlices>,
    [subscribe: Subscribe<TSlice, TOtherSlices>]
  >,
];

export type Output<TSlice extends SliceOf<any, any>, TOtherSlices> = Func<
  StateCreator<TSlice & TOtherSlices, [], [], TSlice>
>;
