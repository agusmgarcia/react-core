import { createContext, useContext, useRef } from "react";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import { devtools } from "zustand/middleware";

import { type CreateGlobalSliceTypes } from "../createGlobalSlice";
import { type Input, type Output, type SlicesOf } from "./createStore.types";

const StoreContext = createContext<Store<any[]> | undefined>(undefined);
StoreContext.displayName = "StoreContext";

/**
 * Creates a store with support for multiple slice factories and provides
 * a React context for accessing the store and its selectors.
 *
 * @template TSliceFactories - An array of slice factory types extending `CreateGlobalSliceTypes.Output`.
 *
 * @param {...Input<TSliceFactories>} input - A list of slice factory inputs used to create the store.
 *
 * @returns {Output<TSliceFactories>} An object containing:
 * - `StoreProvider`: A React component that provides the store context to its children.
 * - `useSelector`: A hook to select and retrieve state from the store.
 *
 * ### Example
 * ```tsx
 * const { StoreProvider, useSelector } = createStore(sliceFactory1, sliceFactory2);
 *
 * function App() {
 *   return (
 *     <StoreProvider initialState={{ key: value }}>
 *       <ChildComponent />
 *     </StoreProvider>
 *   );
 * }
 *
 * function ChildComponent() {
 *   const selectedState = useSelector((state) => state.someKey);
 *   return <div>{selectedState}</div>;
 * }
 * ```
 *
 * ### Notes
 * - The `StoreProvider` component initializes the store and provides it via React context.
 * - The `useSelector` hook allows components to access specific parts of the store's state.
 * - The `devtools` middleware is enabled for debugging purposes.
 *
 * @throws Will throw an error if `useSelector` is used outside of a `StoreProvider`.
 */
export default function createStore<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
>(...input: Input<TSliceFactories>): Output<TSliceFactories> {
  return {
    StoreProvider: (props) => {
      const storeRef = useRef<Store<TSliceFactories>>(null);

      if (!storeRef.current)
        storeRef.current = create<SlicesOf<TSliceFactories>>()(
          devtools(
            (...a) =>
              input.reduce(
                (result, factory) => ({
                  ...result,
                  ...factory(props.initialState)(...a),
                }),
                {},
              ),
            { enabled: true },
          ),
        );

      return (
        <StoreContext.Provider value={storeRef.current}>
          {props.children}
        </StoreContext.Provider>
      );
    },
    useSelector: (selector) => {
      const store = useContext(StoreContext);
      if (!store) throw "";

      return store(selector as any);
    },
  };
}

type Store<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
> = UseBoundStore<StoreApi<SlicesOf<TSliceFactories>>>;
