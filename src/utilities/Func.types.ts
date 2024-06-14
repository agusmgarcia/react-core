type Func<TResult = void, TArgs extends any[] = []> = TResult extends any[]
  ? TArgs extends []
    ? TResult extends [...infer TArgs, infer TResult]
      ? (...args: TArgs) => TResult
      : never
    : (...args: TArgs) => TResult
  : (...args: TArgs) => TResult;

export default Func;
