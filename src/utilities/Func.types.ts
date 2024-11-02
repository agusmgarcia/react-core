type Func<TResult = void, TArgs extends any[] = []> = (
  ...args: TArgs
) => TResult;

export default Func;
