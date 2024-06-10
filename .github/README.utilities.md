# Utilities

A set of functions and types that can be used in the consumer projects.

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

type FuncWithoutArgs = Func; // => () => void
type FuncThatReturnsNumber = Func<[number]>; // => () => number
type FuncWithStringArgThatReturnsNumber = Func<[string, number]>; // => (args_0: string) => number
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

## Use media query

```typescript
import { useMediaQuery } from "@agusmgarcia/react-core";

function useHook() {
  const isTablet = useMediaQuery("(max-width: 767.98px)"); // => boolean
}
```
