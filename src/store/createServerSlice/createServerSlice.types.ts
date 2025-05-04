import {
  type AddArgumentToObject,
  type AsyncFunc,
  type Func,
  type Merge,
  type OmitFuncs,
} from "#src/utils";

import { type CreateGlobalSliceTypes } from "../createGlobalSlice";

/**
 * Represents a slice of state with a specific name, data, selected properties, and extra methods.
 *
 * @template TName - The name of the slice.
 * @template TData - The type of the data managed by the slice.
 * @template TSelected - The type of the selected properties (default is an empty object).
 * @template TExtraMethods - The type of additional methods provided by the slice.
 */
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

/**
 * Extracts the name of a given slice.
 *
 * @template TSlice - The slice type to extract the name from.
 */
export type ExtractNameOf<TSlice extends SliceOf<any, any, any, any>> =
  CreateGlobalSliceTypes.ExtractNameOf<TSlice>;

/**
 * Extracts the data type of a given slice.
 *
 * @template TSlice - The slice type to extract the data from.
 */
export type ExtractDataOf<TSlice extends SliceOf<any, any, any, any>> =
  CreateGlobalSliceTypes.ExtractStateOf<TSlice>["data"];

/**
 * Extracts the selected properties type of a given slice.
 *
 * @template TSlice - The slice type to extract the selected properties from.
 */
export type ExtractSelectedOf<TSlice extends SliceOf<any, any, any, any>> =
  TSlice extends SliceOf<any, any, infer TSelected, any> ? TSelected : never;

/**
 * Extracts the extra methods type of a given slice.
 *
 * @template TSlice - The slice type to extract the extra methods from.
 */
export type ExtractExtraMethodsOf<TSlice extends SliceOf<any, any, any, any>> =
  TSlice extends SliceOf<any, any, any, infer TExtraMethods>
    ? TExtraMethods
    : never;

/**
 * Represents the context for a slice, providing access to state, a setter function, and an abort signal.
 *
 * @template TSlice - The slice type for which the context is created.
 * @template TOtherSlices - Additional slices that may be included in the context.
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
  set: Func<void, [state: React.SetStateAction<ExtractDataOf<TSlice>>]>;

  /**
   * An abort signal to manage the lifecycle of subscriptions.
   */
  signal: AbortSignal;
};

/**
 * A function type for subscribing to changes in a slice's context.
 *
 * @template TSlice - The slice type to subscribe to.
 * @template TOtherSlices - Additional slices that may be included in the subscription.
 *
 * @param listener - A function that is called when the context changes.
 * @param selector - An optional function to select specific state properties.
 * @returns A function to unsubscribe from the context.
 */
export type Subscribe<TSlice extends SliceOf<any, any>, TOtherSlices> = (
  listener: Func<void, [context: Context<TSlice, TOtherSlices>]>,
  selector?: Func<any, [state: OmitFuncs<TOtherSlices>]>,
) => Func;

/**
 * Represents the input parameters required to create a slice.
 *
 * @template TSlice - The slice type being created.
 * @template TOtherSlices - Additional slices that may be referenced in the input.
 *
 * @param name - The name of the slice.
 * @param fetcher - An asynchronous function to fetch the slice's data.
 * @param selector - An optional function to select properties from other slices.
 * @param factory - An optional function to create extra methods for the slice.
 */
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

/**
 * Represents the output of a slice, including its state and additional properties.
 *
 * @template TSlice - The slice type being output.
 * @template TOtherSlices - Additional slices that may be included in the output.
 */
export type Output<
  TSlice extends SliceOf<any, any, any, any>,
  TOtherSlices,
> = CreateGlobalSliceTypes.Output<TSlice, TOtherSlices, ExtractDataOf<TSlice>>;
