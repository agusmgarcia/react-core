import type {} from "@redux-devtools/extension";

import { equals, isSSR } from "#src/utilities";

import { type CreateSliceTypes } from "../createSlice";
import { StateOf } from "./createStore.types";

export default function registerDevtools<
  TCreateSliceOutputs extends Record<string, CreateSliceTypes.Output<any, any>>,
>(state: StateOf<TCreateSliceOutputs>): void {
  if (isSSR()) return;

  const connector = window.__REDUX_DEVTOOLS_EXTENSION__;
  if (connector === undefined) return;

  let extension = globalThis.__AGUSMGARCIA_REACT_CORE_DEVTOOLS_EXTENSION__;
  if (extension !== undefined) {
    if (
      equals.deep(globalThis.__AGUSMGARCIA_REACT_CORE_DEVTOOLS_STATE__, state)
    )
      return;

    globalThis.__AGUSMGARCIA_REACT_CORE_DEVTOOLS_STATE__ = state;
    extension.send({ type: "@agusmgarcia/react-core" }, state);
    return;
  }

  extension = globalThis.__AGUSMGARCIA_REACT_CORE_DEVTOOLS_EXTENSION__ =
    connector.connect({
      features: {
        dispatch: false,
        export: false,
        import: false,
        jump: false,
        lock: false,
        pause: false,
        persist: false,
        reorder: false,
        skip: false,
        test: false,
      },
    });

  globalThis.__AGUSMGARCIA_REACT_CORE_DEVTOOLS_STATE__ = state;
  extension.init(state);
}
