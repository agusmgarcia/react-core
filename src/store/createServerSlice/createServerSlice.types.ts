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
  TSelected extends Record<string, any> = {},
  TExtraMethods extends Record<string, Func<any, [...any[]]>> = {},
> = CreateGlobalSliceTypes.SliceOf<
  TName,
  Merge<
    {
      __internal__: Func<TData>;
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
  TSlice extends SliceOf<any, infer TData, any, any> ? TData : never;

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
  set: Func<
    void,
    [state: React.SetStateAction<ExtractDataOf<TSlice> | undefined>]
  >;

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
  selector?: Func<any, [state: OmitFuncs<TSlice & TOtherSlices>]>,
) => Func;

/**
 * Represents an asynchronous function responsible for fetching data for a specific slice.
 *
 * @template TSlice - The slice type for which the data is being fetched.
 *
 * @param args - The selected properties used as arguments for the fetch operation.
 * @param signal - An AbortSignal to handle cancellation of the fetch operation.
 * @param prevData - The previously fetched data, which can be used for incremental updates or comparisons.
 *
 * @returns A promise that resolves to the fetched data of the slice.
 */
export type Fetcher<TSlice extends SliceOf<any, any, any, any>> = AsyncFunc<
  ExtractDataOf<TSlice>,
  [
    args: ExtractSelectedOf<TSlice>,
    signal: AbortSignal,
    prevData: ExtractDataOf<TSlice> | undefined,
  ]
>;

/**
 * A function type for selecting specific properties from the state of other slices.
 *
 * @template TSlice - The slice type for which the selection is being made.
 * @template TOtherSlices - Additional slices that may be included in the state.
 *
 * @param state - The state of other slices, excluding functions.
 * @returns The selected properties of the slice.
 */
export type Selector<
  TSlice extends SliceOf<any, any, any, any>,
  TOtherSlices,
> = Func<ExtractSelectedOf<TSlice>, [state: OmitFuncs<TOtherSlices>]>;

/**
 * A function type for creating additional methods for a slice, with access to the slice's context.
 *
 * @template TSlice - The slice type for which the factory is being created.
 * @template TOtherSlices - Additional slices that may be included in the context.
 *
 * @param subscribe - A function to subscribe to changes in the slice's context.
 * @returns An object containing the extra methods for the slice, with the slice's context added as an argument.
 */
export type Factory<
  TSlice extends SliceOf<any, any, any, any>,
  TOtherSlices,
> = Func<
  AddArgumentToObject<
    ExtractExtraMethodsOf<TSlice>,
    Context<TSlice, TOtherSlices>
  >,
  [subscribe: Subscribe<TSlice, TOtherSlices>]
>;

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
export type Input<TSlice extends SliceOf<any, any, any, any>, TOtherSlices> =
  ExtractExtraMethodsOf<TSlice> extends Record<string, never>
    ? ExtractSelectedOf<TSlice> extends Record<string, never>
      ? [
          name: ExtractNameOf<TSlice>,
          fetcher: Fetcher<TSlice>,
          selector?: undefined,
          factory?: undefined,
        ]
      : [
          name: ExtractNameOf<TSlice>,
          fetcher: Fetcher<TSlice>,
          selector: Selector<TSlice, TOtherSlices>,
          factory?: undefined,
        ]
    : ExtractSelectedOf<TSlice> extends Record<string, never>
      ? [
          name: ExtractNameOf<TSlice>,
          fetcher: Fetcher<TSlice>,
          selector: undefined,
          factory: Factory<TSlice, TOtherSlices>,
        ]
      : [
          name: ExtractNameOf<TSlice>,
          fetcher: Fetcher<TSlice>,
          selector: Selector<TSlice, TOtherSlices>,
          factory: Factory<TSlice, TOtherSlices>,
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
> = CreateGlobalSliceTypes.Output<
  TSlice,
  TOtherSlices,
  ExtractDataOf<TSlice> | undefined
>;
