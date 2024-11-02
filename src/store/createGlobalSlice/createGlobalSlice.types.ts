import { type StateCreator } from "zustand";

import { type Func } from "#src/utilities";

export type SliceOf<TName extends string, TState> = Record<TName, TState>;

export type Context<TSlice extends SliceOf<any, any>, TOtherSlices = {}> = {
  get: Func<TSlice & TOtherSlices>;
  set: Func<
    void,
    [
      state:
        | TSlice[keyof TSlice]
        | Func<TSlice[keyof TSlice], [prevState: TSlice[keyof TSlice]]>,
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
  selector?: Func<TSelected, [state: TOtherSlices]>,
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
