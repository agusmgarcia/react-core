import type OnlyId from "./OnlyId.types";

export default function isOnlyId<
  TData extends Record<TIdentifierName, TIdentifierValue>,
  TIdentifierName extends string,
  TIdentifierValue,
>(
  maybeOnlyId: TData | OnlyId<TData, TIdentifierName, TIdentifierValue>,
  id: TIdentifierName,
): maybeOnlyId is OnlyId<TData, TIdentifierName, TIdentifierValue> {
  if (typeof maybeOnlyId !== "object") return false;
  if (!maybeOnlyId) return false;

  const keys = Object.keys(maybeOnlyId);
  if (keys.length !== 1) return false;
  if (keys[0] !== id) return false;

  return true;
}
