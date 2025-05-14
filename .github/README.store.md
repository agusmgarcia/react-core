# Store

An opinionated state manager. It provides tools to create global and server states.

## Global slice

This is the state that is going to be consumed globally across the app. It is handled by `createGlobalSlice` function. It can be **read and written**.

```ts
// ./src/store/FormSearchSlice.ts

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
  clear: (context) => context.set({ asc: false, name: "" }),
  name: "",
  setAsc: (asc, context) => context.set((prev) => ({ ...prev, asc })),
  setName: (name, context) => context.set((prev) => ({ ...prev, name })),
}));
```

## Server slice

The state that is populated from an API or an external resource. It is handled by `createServerSlice` function. Due the way it gets originated, it can be **read** only.

```ts
// ./src/store/FormResultSlice.ts

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

The slices are gathered into a store object. It is handled by `createStore` function. The slices are passed as arguments. Then, they can be accessed thru the `useSelector` hook. You can create custom hooks that access the different pieces of each slice as described in the example below:

```typescript
// ./src/store/index.ts

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

> Make sure to export the `StoreProvider` component as it is going to be used in the entry point of the app.

### Wrap the main component with the created StoreProvider component

```tsx
// ./pages/_app.tsx

import "./_app.css";

import { type AppProps } from "next/app";
import Head from "next/head";

import { StoreProvider } from "#src/store";

export default function App({ Component, pageProps }: AppProps<any>) {
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </>
  );
}
```
