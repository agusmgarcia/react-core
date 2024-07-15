type Func<
  TResult = void,
  TArgs extends any[] | undefined = undefined,
> = TArgs extends undefined
  ? TResult extends [...infer TArgs, infer TResult]
    ? (...args: TArgs) => TResult
    : () => TResult
  : TArgs extends any[]
    ? (...args: TArgs) => TResult
    : never;

// TODO: use this definition on the next major release.
// type Func<TResult = void, TArgs extends any[] = []> = (
//   ...args: TArgs
// ) => TResult;

export default Func;
