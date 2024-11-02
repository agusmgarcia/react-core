import { useEffect, useMemo, useState } from "react";

import capitalize from "./capitalize";

// TODO: delete this entire file.

type DefaultValues<TName extends "checked" | "value"> = Record<
  TName,
  TName extends "checked" ? boolean : string
> &
  Record<
    `default${Capitalize<TName>}`,
    TName extends "checked" ? boolean : string
  >;

/**
 * @deprecated This method is going to be deleted in the next major version.
 */
export function useValueTracker<
  TElement extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
>(
  elementRef: React.RefObject<TElement>,
  props: Partial<DefaultValues<"value">> | undefined,
): string {
  return useCheckedOrValueTracker(elementRef, "value", props);
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

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) return;

    const handle = () => setValue((element as any)[propertyName]);
    handle();

    element.addEventListener("change", handle);
    return () => element.removeEventListener("change", handle);
  }, [elementRef, propertyName]);

  return value as any;
}
