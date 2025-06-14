# Utilities

A set of functions and types that can be used in the consumer projects.

## Add argument to object

```typescript
import { type AddArgumentToObject } from "@agusmgarcia/react-core";

type Person = { name: string; setName: Func<void, [name: string]> };
type PersonWithContext = AddArgumentToObject<Person, number>; // => { name: string; setName: Func<void, [name: string, parameter: number]> }
```

## Aggregate response

```typescript
const result = await aggregateResponse(
  (pageIndex, pageSize) =>
    fetch(`/api?page=${pageIndex}&limit=${pageSize}`).then((result) =>
      result.json(),
    ),
  10,
);
```

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

## Children

```tsx
import { children } from "@agusmgarcia/react-core";

const MyComponent = () => (
  <div>
    <input />
  </div>
);

const inputChildren = children.getOfType(input, MyComponent); // => React.ReactElement<InputProps, input>[]

const children = children.mapOfType(input, MyComponent, (child) => (
  <p>input replaced</p>
)); // => <div><p>input replaced</p></div>

const isMyComponent = children.isOfType(MyComponent, <MyComponent />); // => true;
```

## Dates

```typescript
import { dates } from "@agusmgarcia/react-core";

dates.addDays("1995-06-17", 1); // => "1995-06-18"
dates.addMonths("1995-06-17", 1); // => "1995-07-17"
dates.addYears("1995-06-17", 1); // => "1996-06-17"
dates.clamp("1995-06-17", "1995-06-12", "1995-06-18"); // => "1995-06-17"
dates.differenceInDays("1995-06-17", "1995-05-30"); // => 18
dates.getCurrentDate(); // => the current date considering the timeZone
dates.getDate("1995-06-17"); // => 17
dates.getDayOfTheWeek("1995-06-17"); // => 6
dates.getFirstDateOfMonth("1995-06-17"); // => "1995-06-01"
dates.getLastDateOfMonth("1995-06-17"); // => "1995-06-30"
dates.getMonth("1995-06-17"); // => 6
dates.getYear("1995-06-17"); // => 1995
dates.max("1995-06-17", "1995-06-18", "1995-06-12"); // => "1995-06-18"
dates.min("1995-06-17", "1995-06-18", "1995-06-12"); // => "1995-06-12"
dates.toDateString("1995-06-17", "en-US", { day: "2-digit" }); // => "17"
dates.toString(new Date(1995, 5, 17)); // => "1995-06-17"
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
equals.deep(
  { name: "john", address: { street: "doe" } },
  { name: "john", address: { street: "doe" } },
); // => true
```

## Filters

```typescript
import { filters } from "@agusmgarcia/react-core";

const array = [17, 6, 95, 6];

array.filter(filters.distinct); // => [17, 6, 95]
array.filter(filters.paginate(1, 2)); // => [17, 6]
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

## Merge

```typescript
import { type Merge } from "@agusmgarcia/react-core";

type ObjectA = { name: string };
type ObjectB = { surname: string };
type Result = Merge<ObjectA, ObjectB>; // => { name: string; surname: string; }
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

## Merges

```tsx
import { merges } from "@agusmgarcia/react-core";

merges.shallow({ name: "John" }, { surname: "Doe" }); // => { name: "John", surname: "Doe" }
merges.deep(
  [{ name: "John" }, { name: "Foo" }],
  [{ surname: "Doe" }, { surname: "Bar" }],
); // => [{ name: "John", surname: "Doe" }, { name: "Foo", surname: "Bar" }];
```

## Omit Funcs

```typescript
import { type Func, type OmitFuncs } from "@agusmgarcia/react-core";

type Person = { id: string; name: string; setName: Func<void, [name: string]> };

type OmitFuncsPerson = OmitFuncs<Person>; // => { id: string; name: string }
```

## Only id

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

## Throw error

```typescript
import { throwError } from "@agusmgarcia/react-core";

const result = input.startsWith("a")
  ? true
  : throwError("Input should start with 'a'");
```

## Tuple

```typescript
import { type Tuple } from "@agusmgarcia/react-core";

type TupleOfThreeStrings = Tuple<string, 3>; // => [string, string, string]
```

## Tuple to union

```typescript
import { type TupleToUnion } from "@agusmgarcia/react-core";

type AorB = TupleToUnion<["a", "b"]>; // => "a" | "b"
```

## Union to intersection

```typescript
import { type UnionToIntersection } from "@agusmgarcia/react-core";

type Person = { person: { id: string } };
type Pet = { pet: { id: string } };

type PersonAndPet = UnionToIntersection<Person | Pet>; // => { person: { id: string }; pet: { id: string } }
```

## Union to tuple

```typescript
import { type UnionToTuple } from "@agusmgarcia/react-core";

type ArrayOfAOrB = UnionToTuple<"a" | "b">; // => ["a", "b"]
```

## Use device pixel ratio

```typescript
import { useDevicePixelRatio } from "@agusmgarcia/react-core";

function useHook() {
  const devicePixelRatio = useDevicePixelRatio(); // => window.devicePixelRatio
}
```

## Use dimensions

```typescript
import { useDimensions } from "@agusmgarcia/react-core";

function useHook() {
  const ref = useRef<HTMLElement>(null);
  const dimensions = useDimensions(ref); // => The width and height of the element.
}
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
