/**
 * A utility type that extracts only the identifier property from a given type
 * and makes all other properties optional and undefined.
 *
 * @template TData - The type of the object containing the identifier property.
 * @template TIdentifierName - The name of the identifier property. Defaults to `"id"`.
 * @template TIdentifierValue - The type of the identifier property value. Defaults to `string`.
 *
 * @example
 * type User = { id: string; name: string; age: number };
 * type UserIdOnly = OnlyId<User>;
 * // Result: { id: string; name?: undefined; age?: undefined }
 */
type OnlyId<
  TData extends Record<TIdentifierName, TIdentifierValue>,
  TIdentifierName extends string = "id",
  TIdentifierValue = string,
> = Pick<TData, TIdentifierName> &
  ToPartialUndefined<Omit<TData, TIdentifierName>>;

type ToPartialUndefined<TModel> = {
  [P in keyof TModel]?: undefined;
};

export default OnlyId;
