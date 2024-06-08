# Store

A hook oriented react state manager.

## Example

### Define a slice

```ts
// ./store/PeopleSlice.ts

import { createSlice, useSWR } from "@agusmgarcia/react-core";
import { useCallback } from "react";

export type Person = {
  id: string;
  name: string;
  surname: string;
};

const PeopleSlice = createSlice(() => {
  const fetchPeople = useCallback(
    (signal: AbortSignal): Person[] =>
      fetch("/api/people", { signal }).then((result) => result.json()),
    [],
  );

  const { data, loading, setData, reload } = useSWR(fetchPeople);

  const editName = useCallback(
    (id: string, name: string) => {
      setData((ppl) => ppl.map((p) => (p.id === id ? { ...p, name } : p)));

      try {
        await fetch(`/api/people/${id}`, {
          body: JSON.stringify({ name }),
          method: "PATCH",
        });
      } finally {
        reload();
      }
    },
    [setData, reload],
  );

  return { data, editName, loading };
});

export default PeopleSlice;
```

### Create the store

```ts
// ./store/index.ts

import { createStore } from "@agusmgarcia/react-core";

import PeopleSlice from "./PeopleSlice";

export { type Person } from "./PeopleSlice";

const { useStore, ...reactStore } = createStore(
  {
    people: PeopleSlice,
  },
  {
    devtools: true,
  },
);

export const StoreProvider = reactStore.StoreProvider;

export function usePeople() {
  return {
    editPersonName: useStore((store) => store.people.editName),
    isPeopleLoading: useStore((store) => store.people.loading),
    people: useStore((store) => store.people.data),
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

### Access the store within components

```tsx
// ./components/App/index.tsx

import React from "react";

import { usePeople } from "./store";

export default function App() {
  const { editPersonName, isPeopleLoading, people } = usePeople();

  return (
    <div>
      <h1>PEOPLE</h1>
      {!isPeopleLoading ? (
        <div>
          {people.map((p) => (
            <div key={p.id}>
              <h2>{people.name}</h2>
              <h2>{people.surname}</h2>
              <button onClick={() => editPersonName(p.id, "Foo")}>
                Change name
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
```

## Types

### useSWR

#### Input

- `initialData`: the initial state
- `fetcher()`: function to get new data

#### Output

- `data`: data for the given key resolved by fetcher (or undefined if not loaded).
- `error`: error thrown by fetcher (or undefined).
- `initialized`: whether the slice has been initialized.
- `loading`: if there's a request or revalidation loading.
- `reload()`: function to refetch data.
- `setData(newData)`: function to mutate the cached data.
