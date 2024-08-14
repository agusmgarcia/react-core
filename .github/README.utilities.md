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

dates.addDays("2024-06-01", 1); // => "2024-06-02"
dates.addMonths("2024-06-01", 1); // => "2024-07-01"
dates.addYears("2024-06-01", 1); // => "2025-06-01"
dates.clamp("2024-06-15", "2024-06-18", "2024-06-12"); // => "2024-06-15"
dates.differenceInDays("2024-06-02", "2024-06-01"); // => 1
dates.formatDate("2024-06-02", "dd"); // => "02"
dates.getCurrentDate(); // => "2024-06-01"
dates.getFirstDateOfMonth("2024-06-15"); // => "2024-06-01"
dates.getLastDateOfMonth("2024-06-15"); // => "2024-06-30"
dates.max("2024-06-15", "2024-06-18", "2024-06-12"); // => "2024-06-18"
dates.min("2024-06-15", "2024-06-18", "2024-06-12"); // => "2024-06-12"
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

## Func

```typescript
import { type Func } from "@agusmgarcia/react-core";

type Func1 = Func; // => () => void
type Func2 = Func<number>; // => () => number
type Func3 = Func<number, [arg0: string]>; // => (arg0: string) => number
```

## Func (old-way)

This is kept for compatibility with versions `v2.x.x`. It is going to be removed in the next major release.

```typescript
import { type Func } from "@agusmgarcia/react-core";

type Func1 = Func; // => () => void
type Func2 = Func<[number]>; // => () => number
type Func3 = Func<[arg0: string, number]>; // => (arg0: string) => number
```

## Is child of

```typescript
import { isChildOf } from "@agusmgarcia/react-core";

const child = document.getElementById("element1");
const potentialParent = document.getElementById("element2");
return isChildOf(potentialParent, child);
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
replaceString("${nights} ${nights:night/nights}", { nights: 1 }); // => "1 night"
replaceString("${nights} ${nights:night/nights}", { nights: 2 }); // => "2 nights"
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

## Use at bottom

```typescript
import { useAtBottom } from "@agusmgarcia/react-core";
import { useRef } from "react";

function useHook() {
  const elementRef = useRef<HTMLElement>(null);
  const atBottom = useAtBottom(elementRef); // => true if the element has been scrolled at bottom
}
```

## Use at top

```typescript
import { useAtTop } from "@agusmgarcia/react-core";
import { useRef } from "react";

function useHook() {
  const elementRef = useRef<HTMLElement>(null);
  const atTop = useAtTop(elementRef); // => true if the element has been scrolled at top
}
```

## Use media query

```typescript
import { useMediaQuery } from "@agusmgarcia/react-core";

function useHook() {
  const isTablet = useMediaQuery("(max-width: 767.98px)"); // => boolean
}
```
