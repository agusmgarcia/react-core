type AsyncFunc<TResult = void, TArgs extends any[] = []> = (
  ...args: TArgs
) => Promise<TResult>;

export default AsyncFunc;
