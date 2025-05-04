import { type StateCreator } from "zustand";

import { equals, isSSR, merges, type OmitFuncs } from "#src/utils";

import {
  type Context,
  type ExtractNameOf,
  type ExtractStateOf,
  type Input,
  type Output,
  type SliceOf,
  type Subscribe,
} from "./createGlobalSlice.types";

/**
 * Creates a global slice for store management.
 *
 * This function is used to define a slice of state and its associated actions
 * for a store. It supports server-side rendering (SSR) and provides
 * utilities for subscribing to state changes and managing context.
 *
 * @template TSlice - The type of the slice being created.
 * @template TOtherSlices - The type of other slices in the store.
 *
 * @param {...Input<TSlice, TOtherSlices>} input - The input parameters for creating the slice.
 *   - `name`: The name of the slice.
 *   - `sliceFactory`: A factory function that defines the slice's state and actions.
 *
 * @returns {Output<TSlice, TOtherSlices, ExtractStateOf<TSlice>>} A function that initializes the slice
 *   with the given initial state and integrates it into the store.
 *
 * @example
 * ```typescript
 * const createExampleSlice = createGlobalSlice(
 *   "exampleSlice",
 *   () => ({
 *     count: 0,
 *     increment: (context) => context.set((state) => ({ count: state.count + 1 })),
 *   })
 * );
 * ```
 */
export default function createGlobalSlice<
  TSlice extends SliceOf<any, any>,
  TOtherSlices = {},
>(
  ...input: Input<TSlice, TOtherSlices>
): Output<TSlice, TOtherSlices, ExtractStateOf<TSlice>> {
  return (initialState) => (set, get, store) => {
    let controller = new AbortController();

    const name = input[0];

    const subscribe: Subscribe<TSlice, TOtherSlices> = (listener, selector) => {
      const unsubscribe = store.subscribe((state, prevState) => {
        const selection = !!selector
          ? selector(state as OmitFuncs<TOtherSlices>)
          : ({} as ReturnType<NonNullable<typeof selector>>);

        const prevSelection = !!selector
          ? selector(prevState as OmitFuncs<TOtherSlices>)
          : ({} as ReturnType<NonNullable<typeof selector>>);

        if (equals.shallow(selection, prevSelection, 2)) return;

        listener(
          buildContext<TSlice, TOtherSlices>(name, controller, get, set),
        );
      });

      if (!isSSR()) {
        setTimeout(
          () =>
            listener(
              buildContext<TSlice, TOtherSlices>(name, controller, get, set),
            ),
          0,
        );
      }

      return unsubscribe;
    };

    const factory = input[1](subscribe);

    if (typeof factory !== "object" || !factory)
      return {
        [name]:
          !!initialState && name in initialState ? initialState[name] : factory,
      } as TSlice;

    const result = Object.keys(factory).reduce(
      (result, key) => {
        const element = factory[key];
        result[name][key] = element;

        if (element instanceof Function) {
          result[name][key] = (...args: any[]) => {
            const ctx = buildContext<TSlice, TOtherSlices>(
              name,
              controller,
              get,
              set,
            );

            try {
              const result = element(...args, ctx);
              if (!(result instanceof Promise)) return result;

              return result.catch((error) => {
                if (ctx.signal.aborted) return;
                throw error;
              });
            } catch (error) {
              if (ctx.signal.aborted) return;
              throw error;
            }
          };
        }

        return result;
      },
      { [name]: {} } as TSlice,
    );

    return { [name]: { ...result[name], ...initialState?.[name] } } as TSlice;
  };
}

function buildContext<TSlice extends SliceOf<any, any>, TOtherSlices>(
  name: ExtractNameOf<TSlice>,
  controller: AbortController,
  get: Parameters<StateCreator<TSlice & TOtherSlices, [], [], TSlice>>[1],
  set: Parameters<StateCreator<TSlice & TOtherSlices, [], [], TSlice>>[0],
): Context<TSlice, TOtherSlices> {
  controller.abort();
  controller = new AbortController();
  const signal = controller.signal;

  return {
    get: () => {
      signal.throwIfAborted();
      return get() as OmitFuncs<TSlice & TOtherSlices>;
    },
    set: (state) => {
      signal.throwIfAborted();
      return set((prev) => {
        const newState = state instanceof Function ? state(prev[name]) : state;
        return merges.shallow(prev, { [name]: newState }, 2);
      });
    },
    signal,
  };
}
