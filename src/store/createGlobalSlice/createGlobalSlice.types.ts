import { type StateCreator } from "zustand";

import {
  type AddArgumentToObject,
  type Func,
  type OmitFuncs,
} from "#src/utils";

/**
 * Represents a slice of the global state with a specific name and state type.
 *
 * @template TName - The name of the slice.
 * @template TState - The type of the state within the slice.
 */
export type SliceOf<TName extends string, TState> = Record<TName, TState>;

/**
 * Extracts the name of a slice from a `SliceOf` type.
 *
 * @template TSlice - The slice type to extract the name from.
 */
export type ExtractNameOf<TSlice extends SliceOf<any, any>> =
  TSlice extends SliceOf<infer TName, any> ? TName : never;

/**
 * Extracts the state type of a slice from a `SliceOf` type.
 *
 * @template TSlice - The slice type to extract the state from.
 */
export type ExtractStateOf<TSlice extends SliceOf<any, any>> =
  TSlice extends SliceOf<any, infer TState> ? TState : never;

/**
 * Represents the context provided to a slice, including methods for getting and setting state,
 * and an abort signal for managing subscriptions.
 *
 * @template TSlice - The slice type for which the context is provided.
 * @template TOtherSlices - The other slices that may be combined with the current slice.
 */
export type Context<TSlice extends SliceOf<any, any>, TOtherSlices = {}> = {
  /**
   * A function to get the current state of the slice and other slices, excluding functions.
   */
  get: Func<OmitFuncs<TSlice & TOtherSlices>>;

  /**
   * A function to set the state of the slice.
   *
   * @param state - A function or value to update the state.
   */
  set: Func<
    void,
    [state: React.SetStateAction<OmitFuncs<ExtractStateOf<TSlice>>>]
  >;

  /**
   * An abort signal to manage the lifecycle of subscriptions.
   */
  signal: AbortSignal;
};

/**
 * Represents a subscription function for a slice, allowing listeners to be notified of state changes.
 *
 * @template TSlice - The slice type for which the subscription is created.
 * @template TOtherSlices - The other slices that may be combined with the current slice.
 *
 * @param listener - A function to be called when the state changes, receiving the current context.
 * @param selector - An optional function to select a specific part of the state.
 *
 * @returns A function to unsubscribe the listener.
 */
export type Subscribe<TSlice extends SliceOf<any, any>, TOtherSlices> = (
  listener: Func<void, [context: Context<TSlice, TOtherSlices>]>,
  selector?: Func<any, [state: OmitFuncs<TSlice & TOtherSlices>]>,
) => Func;

/**
 * Represents the input required to create a slice, including its name and a factory function.
 *
 * @template TSlice - The slice type being created.
 * @template TOtherSlices - The other slices that may be combined with the current slice.
 *
 * @param name - The name of the slice.
 * @param sliceFactory - A factory function to create the slice's state, receiving the context and subscription function.
 */
export type Input<TSlice extends SliceOf<any, any>, TOtherSlices> = [
  name: ExtractNameOf<TSlice>,
  sliceFactory: Func<
    AddArgumentToObject<ExtractStateOf<TSlice>, Context<TSlice, TOtherSlices>>,
    [subscribe: Subscribe<TSlice, TOtherSlices>]
  >,
];

/**
 * Represents the output of a slice creation function, which is a state creator function.
 *
 * @template TSlice - The slice type being created.
 * @template TOtherSlices - The other slices that may be combined with the current slice.
 * @template TInitialState - The initial state type for the slice.
 *
 * @param initialState - An optional initial state for the slice, which can be partial or undefined.
 *
 * @returns A state creator function for the slice.
 */
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
