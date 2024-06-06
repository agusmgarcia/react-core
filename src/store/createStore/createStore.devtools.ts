import type {} from "@redux-devtools/extension";

import { equals, isSSR } from "../../utilities";
import { type CreateSliceTypes } from "../createSlice";
import { StateOf } from "./createStore.types";

export default function registerDevtools<
  TCreateSliceOutputs extends Record<string, CreateSliceTypes.Output<any, any>>,
>(state: StateOf<TCreateSliceOutputs>): void {
  var __AGUSMGARCIA_REACT_CORE_DEVTOOLS_EXTENSION__:
    | ReturnType<
        NonNullable<typeof window.__REDUX_DEVTOOLS_EXTENSION__>["connect"]
      >
    | undefined;

  var __AGUSMGARCIA_REACT_CORE_DEVTOOLS_STATE__:
    | StateOf<Record<string, any>>
    | undefined;

  if (isSSR()) return;

  const connector = window.__REDUX_DEVTOOLS_EXTENSION__;
  if (connector === undefined) return;

  let extension = __AGUSMGARCIA_REACT_CORE_DEVTOOLS_EXTENSION__;
  if (extension !== undefined) {
    if (equals.deep(__AGUSMGARCIA_REACT_CORE_DEVTOOLS_STATE__, state)) return;
    __AGUSMGARCIA_REACT_CORE_DEVTOOLS_STATE__ = state;
    extension.send({ type: "@agusmgarcia/react-core" }, state);
    return;
  }

  extension = __AGUSMGARCIA_REACT_CORE_DEVTOOLS_EXTENSION__ = connector.connect(
    {
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
    },
  );

  __AGUSMGARCIA_REACT_CORE_DEVTOOLS_STATE__ = state;
  extension.init(state);
}
