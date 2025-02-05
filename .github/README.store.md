# Store

An opinionated react state manager based on hooks. It provides tools to create global and server slices.

## Global slice

This is the information that is going to be consumed globally across the app. It is handled by `createGlobalSlice` function from the library.

```ts
// ./store/FormSearchSlice.ts

import {
  createGlobalSlice,
  type CreateGlobalSliceTypes,
  type Func,
} from "@agusmgarcia/react-core";

export type FormSearchSlice = CreateGlobalSliceTypes.SliceOf<
  "formSearch",
  {
    asc: boolean;
    clear: Func;
    name: string;
    setAsc: Func<void, [asc: boolean]>;
    setName: Func<void, [name: string]>;
  }
>;

export default createGlobalSlice<FormSearchSlice>("formSearch", () => ({
  asc: false,
  clear: (ctx) => ctx.set({ asc: false, name: "" }),
  name: "",
  setAsc: (asc, ctx) => ctx.set((prev) => ({ ...prev, asc })),
  setName: (name, ctx) => ctx.set((prev) => ({ ...prev, name })),
}));
```

## Server slice

The state that is populated from an API or an external resource. It also handles automatic revalidation.

```ts
// ./store/FormResultSlice.ts

import {
  createServerSlice,
  type CreateServerSliceTypes,
  type Func,
} from "@agusmgarcia/react-core";

import { type FormSearchSlice } from "./FormSearch.ts";

export type FormResultSlice = CreateServerSliceTypes.SliceOf<
  "formResult",
  { age: number; name: string; surname: string }[],
  { asc: boolean; name: string }
>;

export default createServerSlice<FormResultSlice, FormSearchSlice>(
  "formResult",
  ({ asc, name }, signal) =>
    fetch(`/api/search?asc=${asc}&name=${name}`, { signal }),
  (state) => ({ asc: state.formSearch.asc, name: state.formSearch.name }),
);
```

## Store

```typescript
import { createStore } from "@agusmgarcia/react-core";

import createFormSearchSlice from "./FormSearchSlice";
import createFormResultSlice from "./FormResultSlice";

const { useSelector, ...reactStore } = createStore(
  createFormSearchSlice,
  createFormResultSlice,
);

export const StoreProvider = reactStore.StoreProvider;

export function useFormSearch() {
  return {
    clearFormSearch: useSelector((state) => state.formSearch.clear),
    formSearchAsc: useSelector((state) => state.formSearch.asc),
    formSearchName: useSelector((state) => state.formSearch.name),
    setFormSearchAsc: useSelector((state) => state.formSearch.setAsc),
    setFormSearchName: useSelector((state) => state.formSearch.setName),
  };
}

export function useFormResult() {
  return {
    formResult: useSelector((state) => state.formResult.data),
    formResultError: useSelector((state) => state.formResult.error),
    formResultLoading: useSelector((state) => state.formResult.loading),
    formResultReload: useSelector((state) => state.formResult.reload),
  };
}
```

### Wrap the main component with the created store provider

```tsx
// ./index.tsx

import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import { StoreProvider } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
```
