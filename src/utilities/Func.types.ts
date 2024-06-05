type Func<TModel extends [...any[], any] = [void]> = TModel extends [
  ...infer TArgs,
  infer TResult,
]
  ? (...args: TArgs) => TResult
  : never;

export default Func;
