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
