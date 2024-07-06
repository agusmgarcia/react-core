import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  createContext as createContextSelector,
  useContextSelector,
} from "use-context-selector";

import { equals } from "#src/utilities";

import { type CreateSliceTypes } from "../createSlice";
import registerDevtools from "./createStore.devtools";
import { type Input, type Output, type StateOf } from "./createStore.types";

const StateContext = createContextSelector({} as StateOf<any>);
StateContext.displayName = "Store";

export default function createStore<
  TCreateSliceOutputs extends Record<string, CreateSliceTypes.Output<any, any>>,
>(
  ...[sliceHooks, options]: Input<TCreateSliceOutputs>
): Output<TCreateSliceOutputs> {
  const hooks = Object.entries(sliceHooks).map(([sliceName, sliceHook]) => {
    sliceHook.sliceName = sliceName;
    return sliceHook;
  }) as (CreateSliceTypes.Output<any, any> & { sliceName: string })[];

  const initialState = {} as StateOf<TCreateSliceOutputs>;

  return {
    StoreProvider: (props) => {
      const lastStateRef = useRef(initialState);
      const isFirstTimeRef = useRef(true);

      const [_, triggerRender] = useState(false);

      const useSelector: CreateSliceTypes.UseSelector<any> = useCallback(
        (selector) => selector(lastStateRef.current),
        [],
      );

      const state = hooks.reduce((result, hook) => {
        const initials = props.initials?.[hook.sliceName];
        result[hook.sliceName as keyof TCreateSliceOutputs] = hook(
          initials,
          useSelector,
        );
        return result;
      }, {} as StateOf<TCreateSliceOutputs>);

      if (lastStateRef.current === initialState) lastStateRef.current = state;

      useEffect(() => {
        if (
          !isFirstTimeRef.current &&
          equals.shallow(state, lastStateRef.current, 2)
        )
          return;

        isFirstTimeRef.current = false;
        lastStateRef.current = state;

        if (!!options?.devtools) registerDevtools(lastStateRef.current);
        triggerRender((prev) => !prev);
      }, [state]);

      return (
        <StateContext.Provider value={lastStateRef.current}>
          {props.children}
        </StateContext.Provider>
      );
    },
    useSelector: (selector) => useContextSelector(StateContext, selector),
  };
}
