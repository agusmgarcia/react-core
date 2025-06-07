import {
  type AddArgumentToObject,
  type AsyncFunc,
  catchError,
  type Func,
  type OmitFuncs,
} from "#src/utils";

import createGlobalSlice, {
  type CreateGlobalSliceTypes,
} from "../createGlobalSlice";
import {
  type Context,
  type ExtractDataOf,
  type ExtractExtraMethodsOf,
  type ExtractNameOf,
  type ExtractSelectedOf,
  type Input,
  type Output,
  type SliceOf,
  type Subscribe,
  type SubscribeContext,
} from "./createServerSlice.types";

/**
 * Creates a server slice for managing state and asynchronous data fetching.
 *
 * @template TSlice - The type of the slice being created.
 * @template TOtherSlices - The type of other slices in the global state.
 *
 * @param {...Input<TSlice, TOtherSlices>} input - The input parameters for creating the server slice.
 *   - `name`: The name of the slice.
 *   - `fetcher`: A function to fetch data for the slice.
 *   - `selector`: An optional selector function to extract relevant state.
 *   - `factory`: An optional factory function to create extra methods for the slice.
 *
 * @returns {Output<TSlice, TOtherSlices>} A function that initializes the slice with initial data.
 *
 * @description
 * This function creates a server slice that integrates with a global state management system.
 * It provides methods for reloading and loading more data, as well as handling asynchronous
 * operations with proper state updates for `loading`, `error`, and `data`.
 *
 * The slice is built on top of a global slice and extends its functionality with server-specific
 * methods. It supports merging new data with existing data when loading more and allows for
 * custom extra methods to be defined via the `factory` parameter.
 *
 * @example
 * ```typescript
 * const createExampleSlice = createServerSlice({
 *   "exampleSlice",
 *   async ({ query }, signal) =>
 *     fetch(`/api/users?query=${query}`, { signal }).then((res) => res.json()),
 *   (state) => ({ query: state.searchQuery }),
 * });
 * ```
 */
export default function createServerSlice<
  TSlice extends SliceOf<any, any, any, any>,
  TOtherSlices = {},
>(...input: Input<TSlice, TOtherSlices>): Output<TSlice, TOtherSlices> {
  return (initialData, middleware) => {
    const name = input[0];
    const fetcher = input[1];
    const selector = input[2];
    const factory = input[3];

    async function reloadHelper(
      args: Partial<ExtractSelectedOf<TSlice>> | undefined,
      context: CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
      mergeData: Func<
        ExtractDataOf<TSlice>,
        [
          newData: ExtractDataOf<TSlice>,
          prevData: ExtractDataOf<TSlice> | undefined,
        ]
      >,
    ): Promise<void> {
      try {
        context.set((prevState) => ({ ...prevState, loading: true }));

        const selected = !!selector
          ? selector(context.get() as OmitFuncs<TOtherSlices, "shallow">)
          : ({} as ExtractSelectedOf<TSlice>);

        const data = await fetcher(
          { ...selected, ...args },
          context.signal,
          context.get()[name].data,
        );

        context.set((prevState) => ({
          ...prevState,
          data: mergeData(data, prevState.data),
          error: undefined,
          loading: false,
        }));
      } catch (error) {
        context.set((prevState) => ({
          ...prevState,
          error: undefined,
          loading: false,
        }));
        throw error;
      }
    }

    async function loadMore(
      args: Partial<ExtractSelectedOf<TSlice>> | undefined,
      context: CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
    ): Promise<void> {
      return reloadHelper(args, context, (newData, prevData) =>
        Array.isArray(prevData) && Array.isArray(newData)
          ? ([...prevData, ...newData] as ExtractDataOf<TSlice>)
          : newData,
      );
    }

    async function reload(
      args: Partial<ExtractSelectedOf<TSlice>> | undefined,
      context: CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
    ): Promise<void> {
      return reloadHelper(args, context, (newData) => newData);
    }

    function __internal__(): ExtractDataOf<TSlice> {
      throw new Error("This method is for internal purposes");
    }

    const result = createGlobalSlice<TSlice, TOtherSlices>(
      name,
      (subscribe) => {
        subscribe(
          (context) => context.get()[name].reload(undefined),
          selector as Parameters<Subscribe<TSlice, TOtherSlices>>[1],
        );

        const serverSubscribe: Subscribe<TSlice, TOtherSlices> = (
          listener,
          selector,
        ) =>
          subscribe(
            (context) =>
              listener(
                buildContext(
                  loadMore,
                  reload,
                  context as CreateGlobalSliceTypes.Context<
                    TSlice,
                    TOtherSlices
                  >,
                ) as SubscribeContext<TSlice, TOtherSlices>,
              ),
            selector,
          );

        const serverExtraMethods =
          factory?.(serverSubscribe) ||
          ({} as AddArgumentToObject<
            ExtractExtraMethodsOf<TSlice>,
            Context<TSlice, TOtherSlices>,
            "strict"
          >);

        const extraMethods = Object.keys(serverExtraMethods).reduce(
          (result, key) => {
            const element = serverExtraMethods[key];
            result[key] = (...args: any[]) =>
              element(
                ...args.slice(0, -1),
                buildContext(loadMore, reload, args.at(-1)),
              );
            return result;
          },
          {} as AddArgumentToObject<
            ExtractExtraMethodsOf<TSlice>,
            CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
            "strict"
          >,
        );

        return {
          ...extraMethods,
          __internal__,
          data: undefined,
          error: undefined,
          loading: true,
          loadMore,
          reload,
        } as AddArgumentToObject<
          CreateGlobalSliceTypes.ExtractStateOf<TSlice>,
          CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
          "strict"
        >;
      },
    );

    return result(
      {
        [name]: {
          data: initialData?.[name],
          error: undefined,
          loading: true,
        },
      } as Record<
        ExtractNameOf<TSlice>,
        OmitFuncs<CreateGlobalSliceTypes.ExtractStateOf<TSlice>, "strict">
      >,
      (callback, context, slice, property) =>
        catchError(
          () => middleware(callback, context, slice, property),
          (error) => {
            if (property !== "reload" && property !== "loadMore") throw error;
            context.set((prevState) => ({ ...prevState, error }));
          },
        ),
    );
  };
}

function buildContext<TSlice extends SliceOf<any, any, any, any>, TOtherSlices>(
  loadMore: AsyncFunc<
    void,
    [
      args: Partial<ExtractSelectedOf<TSlice>> | undefined,
      context: CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
    ]
  >,
  reload: AsyncFunc<
    void,
    [
      args: Partial<ExtractSelectedOf<TSlice>> | undefined,
      context: CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
    ]
  >,
  context: CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
): Context<TSlice, TOtherSlices> {
  return {
    get: context.get,
    loadMore: (...args) => loadMore(...args, context),
    reload: (...args) => reload(...args, context),
    set: (state) =>
      context.set((prev) => ({
        ...prev,
        data: state instanceof Function ? state(prev.data) : state,
        error: undefined,
        loading: false,
      })),
    signal: context.signal,
  };
}
