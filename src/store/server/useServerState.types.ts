import { type Func } from "#src/utilities";

export type ValidData = boolean | number | object | null | string | undefined;

export type State<TData extends ValidData> = {
  data: TData;
  error: unknown;
  loading: boolean;
};

export type Input<TData extends ValidData> = [
  fetcher: Func<TData | Promise<TData>, [signal: AbortSignal]>,
  initialData: TData,
];

export type Output<TData extends ValidData> = State<TData> & {
  reload: Func;
};
