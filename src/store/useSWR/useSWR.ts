import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  type Input,
  type Output,
  type State,
  type ValidData,
} from "./useSWR.types";

export default function useSWR<TData extends ValidData = any>(): Output<
  TData | undefined
>;

export default function useSWR<TData extends ValidData = any>(
  // eslint-disable-next-line unused-imports/no-unused-vars
  initialData: Input<TData>[0],
  // eslint-disable-next-line unused-imports/no-unused-vars
  fetcher?: Input<TData>[1],
): Output<TData>;

export default function useSWR<TData extends ValidData = any>(
  initialDataFromProps?: Input<TData | undefined>[0],
  fetcherFromProps?: Input<TData | undefined>[1],
): Output<TData | undefined> {
  const controllerRef = useRef<AbortController>();
  const id = useId();

  const initialState = useMemo<State<TData | undefined>>(
    () => ({
      data: initialDataFromProps,
      error: undefined,
      initialized: false,
      loading: false,
    }),
    [initialDataFromProps],
  );

  const [state, setState] = useState(initialState);
  const [reloadTrigger, setReloadTrigger] = useState(false);

  const fetcher = useCallback(
    async (signal: AbortSignal) =>
      fetcherFromProps instanceof Function
        ? await fetcherFromProps(signal)
        : id,
    [fetcherFromProps, id],
  );

  const reload = useCallback<Output<TData | undefined>["reload"]>(
    () => setReloadTrigger((prev) => !prev),
    [],
  );

  const setData = useCallback<Output<TData | undefined>["setData"]>((args) => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    setState((prevState) => ({
      data: args instanceof Function ? args(prevState.data) : args,
      error: undefined,
      initialized: true,
      loading: false,
    }));
  }, []);

  useEffect(() => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    const controller = controllerRef.current;

    setState((prevState) => ({ ...prevState, loading: true }));
    fetcher(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setState((prevState) => ({
          data: data === id ? prevState.data : (data as TData | undefined),
          error: undefined,
          initialized: prevState.initialized || data !== id,
          loading: false,
        }));
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState((prevState) => ({ ...prevState, error, loading: false }));
      });

    return () => controller.abort();
  }, [fetcher, id, reloadTrigger, setData]);

  return {
    data: state.data,
    error: state.error,
    initialized: state.initialized,
    loading: state.loading,
    reload,
    setData,
  };
}
