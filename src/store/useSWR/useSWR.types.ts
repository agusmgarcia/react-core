export type ValidData = boolean | number | object | null | string | undefined;

export type State<TData extends ValidData> = {
  data: TData;
  error: unknown;
  initialized: boolean;
  loading: boolean;
};

export type Input<TData extends ValidData> = [
  initialData: TData,
  fetcher: (signal: AbortSignal) => TData | Promise<TData>,
];

export type Output<TData extends ValidData> = {
  data: TData;
  error: unknown;
  initialized: boolean;
  /**
   * @deprecated use `loading` instead. This property will be removed in the next major version.
   */
  isLoading: boolean;
  loading: boolean;
  reload: () => void;
  setData: (args: TData | ((prevData: TData) => TData)) => void;
};
