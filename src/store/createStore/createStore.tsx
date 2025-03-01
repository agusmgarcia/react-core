import React, { createContext, useContext, useRef } from "react";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import { devtools } from "zustand/middleware";

import { type CreateGlobalSliceTypes } from "../createGlobalSlice";
import { type Input, type Output, type StateOf } from "./createStore.types";

type Store<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
> = UseBoundStore<StoreApi<StateOf<TSliceFactories>>>;

const StoreContext = createContext<Store<any[]> | undefined>(undefined);
StoreContext.displayName = "StoreContext";

export default function createStore<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
>(...input: Input<TSliceFactories>): Output<TSliceFactories> {
  return {
    StoreProvider: (props) => {
      const storeRef = useRef<Store<TSliceFactories>>();

      if (!storeRef.current)
        storeRef.current = create<StateOf<TSliceFactories>>()(
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
