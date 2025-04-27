import type OnlyId from "./OnlyId.types";

/**
 * Checks if the given object is an `OnlyId` type.
 *
 * An `OnlyId` type is an object that has only one key, which is the specified `id`.
 *
 * @param maybeOnlyId - The object to check.
 * @param id - The key that should be present in the object.
 * @returns `true` if the object is an `OnlyId`, otherwise `false`.
 */
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
