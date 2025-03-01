type _TupleOf<
  TType,
  TLength extends number,
  TRest extends unknown[],
> = TRest["length"] extends TLength
  ? TRest
  : _TupleOf<TType, TLength, [TType, ...TRest]>;

type Tuple<TType, TLength extends number> = TLength extends TLength
  ? number extends TLength
    ? TType[]
    : _TupleOf<TType, TLength, []>
  : never;

export default Tuple;
