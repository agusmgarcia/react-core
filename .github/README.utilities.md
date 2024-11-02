# Utilities

A set of functions and types that can be used in the consumer projects.

## Async func

```typescript
import { type AsyncFunc } from "@agusmgarcia/react-core";

type Func1 = AsyncFunc; // => () => Promise<void>
type Func2 = AsyncFunc<number>; // => () => Promise<number>
type Func3 = AsyncFunc<number, [arg0: string]>; // => (arg0: string) => Promise<number>
```

## Block until

```typescript
import { blockUntil } from "@agusmgarcia/react-core";

const controller = new AbortController();
blockUntil(controller.signal).then(() => console.log("Continue"));
setTimeout(() => controller.abort(), 3000);
```

## Cache

```typescript
import { Cache } from "@agusmgarcia/react-core";

const cache = new Cache();
cache
  .getOrCreate("key", () => {
    // Run some exclusive function.
  })
  .then((result) => console.log(result));
```

## Capitalize

```typescript
import { capitalize } from "@agusmgarcia/react-core";

capitalize("foo"); // => "Foo"
```

## Currencies

```typescript
import { currencies } from "@agusmgarcia/react-core";

currencies.toString(20); // => "20.00"
currencies.toNumber("20.00"); // => 20
```

## Dates

```typescript
import { dates } from "@agusmgarcia/react-core";

dates.addDays("1995-06-17", 1); // => "1995-06-18"
dates.addMonths("1995-06-17", 1); // => "1995-07-17"
dates.addYears("1995-06-17", 1); // => "1996-06-17"
dates.clamp("1995-06-17", "1995-06-18", "1995-06-12"); // => "1995-06-17"
dates.differenceInDays("1995-06-17", "1995-05-30"); // => 17
dates.getCurrentDate(); // => the current date considering the timeZone
dates.getDate("1995-06-17"); // => 17
dates.getDateOfTheWeek("1995-06-17"); // => 1
dates.getFirstDateOfMonth("1995-06-17"); // => "1995-06-01"
dates.getLastDateOfMonth("1995-06-17"); // => "1995-06-30"
dates.getMonth("1995-06-17"); // => 6
dates.getYear("1995-06-17"); // => 1995
dates.max("1995-06-17", "1995-06-18", "1995-06-12"); // => "1995-06-18"
dates.min("1995-06-17", "1995-06-18", "1995-06-12"); // => "1995-06-12"
dates.toDateString("1995-06-17", "en-US", { day: "2-digit" }); // => "02"
dates.validate("1995-06-17"); // => true
```

## Delay

```typescript
import { delay } from "@agusmgarcia/react-core";

delay(2000).then(() => console.log("Done"));
```

## Empty function

```typescript
import { emptyFunction } from "@agusmgarcia/react-core";

const function = emptyFunction;
```

## Equals

```typescript
import { equals } from "@agusmgarcia/react-core";

equals.strict(1, 1); // => true
equals.shallow({ name: "john" }, { name: "john" }); // => true
equals.strict(
  { name: "john", address: { street: "doe" } },
  { name: "john", address: { street: "doe" } },
); // => true
```

## Finds

```typescript
import { finds } from "@agusmgarcia/react-core";

const array = [17, 6, 95];

array.find(finds.first); // => 17
array.find(finds.single); // => throws error
array.find(finds.singleOrDefault); // => undefined
```

## Func

```typescript
import { type Func } from "@agusmgarcia/react-core";

type Func1 = Func; // => () => void
type Func2 = Func<number>; // => () => number
type Func3 = Func<number, [arg0: string]>; // => (arg0: string) => number
```

## Is child of

```typescript
import { isChildOf } from "@agusmgarcia/react-core";

const child = document.getElementById("element1");
const potentialParent = document.getElementById("element2");
return isChildOf(potentialParent, child);
```

## Is only id

```typescript
import { isOnlyId } from "@agusmgarcia/react-core";

isOnlyId({ id: "3" }); // => true
isOnlyId({ id: "3", name: "John" }); // => false
```

## Is parent of

```typescript
import { isParentOf } from "@agusmgarcia/react-core";

const potentialChild = document.getElementById("element1");
const parent = document.getElementById("element2");
return isParentOf(potentialChild, parent);
```

## Is SSR

```typescript
import { isSSR } from "@agusmgarcia/react-core";

isSSR(); // => 'true' if server side and 'false' for client
```

## Merge refs

```tsx
import { mergeRefs } from "@agusmgarcia/react-core";
import { useRef } from "react";

function Component() {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  return <div ref={mergeRefs(ref1, ref2)} />;
}
```

## Only Id

```typescript
import { type OnlyId } from "@agusmgarcia/react-core";

type Person = { id: string; name: string };

type OnlyIdPerson = OnlyId<Person>; // => { id: string, name?: undefined }
```

## Replace string

```typescript
import { replaceString } from "@agusmgarcia/react-core";

replaceString("This is the ${value} test", { value: "third" }); // => "This is the third test"
replaceString("${nights} ${nights?night:nights}", { nights: 1 }); // => "1 night"
replaceString("${nights} ${nights?night:nights}", { nights: 2 }); // => "2 nights"
```

## Sorts

```typescript
import { sorts } from "@agusmgarcia/react-core";

[1, 2].sort(sorts.byNumberAsc); // => [1, 2]
[1, 2].sort(sorts.byNumberDesc); // => [2, 1]
["john", "doe"].sort(sorts.byStringAsc); // => ["doe", "john"]
["john", "doe"].sort(sorts.byStringDesc); // => ["john", "doe"]
[false, true].sort(sorts.byBooleanAsc); // => [true, false]
[false, true].sort(sorts.byBooleanDesc); // => [false, true]
```

## Storage cache

```typescript
import { StorageCache } from "@agusmgarcia/react-core";

const cache = new StorageCache("myCache", "session");
cache
  .getOrCreate("key", () => {
    // Run some exclusive function.
  })
  .then((result) => console.log(result));
```

## Use element at bottom

```typescript
import { useElementAtBottom } from "@agusmgarcia/react-core";
import { useRef } from "react";

function useHook() {
  const ref = useRef<HTMLElement>(null);
  const atBottom = useElementAtBottom(ref); // => true if the element has been scrolled at bottom
}
```

## Use element at top

```typescript
import { useElementAtTop } from "@agusmgarcia/react-core";
import { useRef } from "react";

function useHook() {
  const ref = useRef<HTMLElement>(null);
  const atTop = useElementAtTop(ref); // => true if the element has been scrolled at top
}
```

## Use media query

```typescript
import { useMediaQuery } from "@agusmgarcia/react-core";

function useHook() {
  const isTablet = useMediaQuery("(max-width: 767.98px)"); // => boolean
}
```
