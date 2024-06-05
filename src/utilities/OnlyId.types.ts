type OnlyId<
  TData extends Record<TIdentifierName, TIdentifierValue>,
  TIdentifierName extends string = "id",
  TIdentifierValue = string,
> = {
  [TPropertyName in keyof TData]: TPropertyName extends TIdentifierName
    ? TData[TPropertyName]
    : undefined;
};

export default OnlyId;
