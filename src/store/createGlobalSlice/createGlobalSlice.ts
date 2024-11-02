import { type StateCreator } from "zustand";

import { equals } from "#src/utilities";

import {
  type Context,
  type Input,
  type Output,
  type SliceOf,
  type Subscribe,
} from "./createGlobalSlice.types";

export default function createGlobalSlice<
  TSlice extends SliceOf<any, any>,
  TOtherSlices = {},
>(...input: Input<TSlice, TOtherSlices>): Output<TSlice, TOtherSlices> {
  return () => (set, get, store) => {
    let controller = new AbortController();

    const name = input[0];

    let firstNotification = true;

    const subscribe: Subscribe<TSlice, TOtherSlices> = (listener, selector) =>
      store.subscribe((state, prevState) => {
        const selection = selector !== undefined ? selector(state) : state;
        const prevSelection =
          selector !== undefined ? selector(prevState) : prevState;

        if (
          !firstNotification &&
          (selector === undefined ||
            equals.shallow(selection, prevSelection, 2))
        )
          return;

        firstNotification = false;

        const ctx = buildContext<TSlice, TOtherSlices>(
          name,
          controller,
          get,
          set,
        );

        listener(selection, ctx);
      });

    const factory = input[1](subscribe);

    if (typeof factory !== "object" || factory === null)
      return { [name]: factory } as TSlice;

    return Object.keys(factory).reduce(
      (result, key) => {
        const element = factory[key as keyof TSlice[keyof TSlice]];
        result[name][key as keyof TSlice[keyof TSlice]] = element as any;

        if (element instanceof Function) {
          result[name][key as keyof TSlice[keyof TSlice]] = ((
            ...args: any[]
          ) => {
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
          }) as any;
        }

        return result;
      },
      { [name]: {} } as TSlice,
    );
  };
}

function buildContext<TSlice extends SliceOf<any, any>, TOtherSlices>(
  name: keyof TSlice,
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
      return get();
    },
    set: (state) => {
      signal.throwIfAborted();
      return set((prev) => {
        const newState = state instanceof Function ? state(prev[name]) : state;

        return {
          ...prev,
          [name]:
            typeof newState === "object"
              ? {
                  ...prev[name],
                  ...newState,
                }
              : newState,
        };
      });
    },
    signal,
  };
}
