# Store

An opinionated react state manager based on hooks. It provides tools to create global and server state.

## Global state

This is the information that is going to be consumed globally across the app. It is handled by `createGlobalState` function from the library.

### Example

In this scenario, the form search state is stored globally. This is the way is must be defined.

```ts
// ./store/global/PeopleFormSearch.ts

import { createGlobalState, type Func } from "@agusmgarcia/react-core";

export type PeopleFormSearch = {
  asc: boolean;
  clear: Func;
  name: string;
  setAsc: Func<void, [asc: boolean]>;
  setName: Func<void, [name: string]>;
};

export default createGlobalState<PeopleFormSearch>(
  () => ({
    asc: false,
    clear: (ctx) => ctx.set({ asc: false, name: "" }),
    name: "",
    setAsc: (asc, ctx) => ctx.set((prev) => ({ ...prev, asc })),
    setName: (name, ctx) => ctx.set((prev) => ({ ...prev, name })),
  }),
  "form-search", // This is an optional argument used by redux-devtools.
);
```

This is the way it must be consumed:

```ts
// ./store/index.ts

import usePeopleFormSearchSelector, {
  type PeopleFormSearch,
} from "./PeopleFormSearch.ts";

export function usePeopleFormSearch() {
  return {
    clearFormSearch: usePeopleFormSearchSelector((state) => state.clear),
    formSearch: usePeopleFormSearchSelector(
      (state) => ({ asc: state.asc, name: state.name }),
      true,
    ),
    setFormSearchAsc: usePeopleFormSearchSelector((state) => state.setAsc),
    setFormSearchName: usePeopleFormSearchSelector((state) => state.setName),
  };
}
```

## Server state

The state that is populated from an API or an external resource. It also handles automatic revalidation.
