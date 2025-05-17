import { type StateCreator } from "zustand";

import {
  type AddArgumentToObject,
  type Func,
  type OmitFuncs,
  type OmitProperty,
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
  get: Func<
    OmitProperty<
      OmitFuncs<TSlice, "shallow"> & TOtherSlices,
      "__internal__",
      "shallow"
    >
  >;

  /**
   * A function to set the state of the slice.
   *
   * @param state - A function or value to update the state.
   */
  set: Func<
    void,
    [state: React.SetStateAction<OmitFuncs<ExtractStateOf<TSlice>, "shallow">>]
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
  selector?: Func<any, [state: OmitFuncs<TSlice & TOtherSlices, "shallow">]>,
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
    AddArgumentToObject<
      ExtractStateOf<TSlice>,
      Context<TSlice, TOtherSlices>,
      "strict"
    >,
    [subscribe: Subscribe<TSlice, TOtherSlices>]
  >,
];

/**
 * Defines the initial state for a slice, which can be a partial record of the slice's name
 * mapped to its initial state (with functions omitted), or undefined.
 *
 * @template TSlice - The slice type for which the initial state is defined.
 * @template TInitialState - The type representing the initial state structure.
 *
 * @remarks
 * - The initial state can be a partial object, allowing only some properties to be specified.
 * - All function properties (except those named "strict") are omitted from the initial state.
 * - If no initial state is provided, `undefined` can be used.
 */
type InitialState<TSlice extends SliceOf<any, any>, TInitialState> =
  | Partial<Record<ExtractNameOf<TSlice>, OmitFuncs<TInitialState, "strict">>>
  | undefined;

/**
 * Represents a middleware function that can intercept or modify the behavior of slice functions.
 *
 * @template TSlice - The slice type being created.
 * @template TOtherSlices - The other slices that may be combined with the current slice.
 *
 * @param callback - The original function to be executed, which can be called, replaced, or wrapped by the middleware.
 * @param context - The context object associated with the slice, providing access to state and utilities.
 * @param slice - The name of the slice being operated on.
 * @param property - The name of the function being called within the slice.
 *
 * @returns The result of the callback or any value as determined by the middleware logic.
 */
export type Middleware<TSlice extends SliceOf<any, any>, TOtherSlices> = Func<
  any,
  [
    callback: Func<any>,
    context: Context<TSlice, TOtherSlices>,
    slice: keyof TOtherSlices,
    property: string,
  ]
>;

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
    initialState: InitialState<TSlice, TInitialState>,
    middleware: Middleware<TSlice, TOtherSlices>,
  ]
>;
