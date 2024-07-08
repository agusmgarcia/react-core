import { type AsyncFunc, type Func } from "#src/utilities";

export type ValidData = boolean | number | object | null | string | undefined;

export type State<TData extends ValidData> = {
  data: TData;
  error: unknown;
  initialized: boolean;
  loading: boolean;
};

export type Input<TData extends ValidData> = [
  initialData: TData,
  fetcher:
    | Func<TData, [signal: AbortSignal]>
    | AsyncFunc<TData, [signal: AbortSignal]>,
];

export type Output<TData extends ValidData> = {
  data: TData;
  error: unknown;
  initialized: boolean;
  loading: boolean;
  reload: Func;
  setData: Func<void, [args: TData | Func<TData, [prevData: TData]>]>;
};
