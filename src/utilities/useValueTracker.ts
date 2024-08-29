import { useEffect, useMemo, useState } from "react";

import capitalize from "./capitalize";

type DefaultValues<TName extends "checked" | "value"> = Record<
  TName,
  TName extends "checked" ? boolean : string
> &
  Record<
    `default${Capitalize<TName>}`,
    TName extends "checked" ? boolean : string
  >;

export function useValueTracker<
  TElement extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
>(
  elementRef: React.RefObject<TElement>,
  props: Partial<DefaultValues<"value">> | undefined,
): string {
  return useCheckedOrValueTracker(elementRef, "value", props);
}

export function useCheckedTracker<TElement extends HTMLInputElement>(
  elementRef: React.RefObject<TElement>,
  props: Partial<DefaultValues<"checked">> | undefined,
): boolean {
  return useCheckedOrValueTracker(elementRef, "checked", props);
}

function useCheckedOrValueTracker<
  TElement extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  TName extends "checked" | "value",
>(
  elementRef: React.RefObject<TElement>,
  propertyName: TName,
  props: Partial<DefaultValues<TName>> | undefined,
): TName extends "checked" ? boolean : string {
  const valueFromProps = useMemo(
    () => props?.[propertyName],
    [propertyName, props],
  );

  const defaultValueFromProps = useMemo(
    () => props?.[`default${capitalize(propertyName)}`],
    [propertyName, props],
  );

  const initialValue = useMemo(
    () =>
      valueFromProps ??
      defaultValueFromProps ??
      (propertyName === "value" ? "" : false),
    [defaultValueFromProps, propertyName, valueFromProps],
  );

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (valueFromProps === undefined) return;
    setValue(valueFromProps);
  }, [valueFromProps]);

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) return;

    const handle = () => setValue((element as any)[propertyName]);
    handle();

    element.addEventListener("input", handle);
    return () => element.removeEventListener("input", handle);
  }, [elementRef, propertyName]);

  return value as any;
}
