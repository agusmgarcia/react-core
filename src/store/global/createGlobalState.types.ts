import { type Func, type OmitFuncs } from "#src/utilities";

export type Context<TState extends object> = {
  get: Func<OmitFuncs<TState>>;
  set: Func<
    void,
    [
      state:
        | OmitFuncs<TState>
        | Func<OmitFuncs<TState>, [prevState: OmitFuncs<TState>]>,
    ]
  >;
  signal: AbortSignal;
};

type FunctionsWithContext<TState extends object> = {
  [TProperty in keyof TState]: TState[TProperty] extends (...args: any[]) => any
    ? Func<
        ReturnType<TState[TProperty]>,
        [...[...args: Parameters<TState[TProperty]>, context: Context<TState>]]
      >
    : TState[TProperty];
};

export type Input<TState extends object> = [
  factory: Func<FunctionsWithContext<TState>>,
  name?: string,
];

export type Output<TState> = <TResult>(
  selector?: Func<TResult, [state: TState]>,
) => TResult;
