import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  type Input,
  type Output,
  type State,
  type ValidData,
} from "./useServerState.types";

export default function useServerState<TData extends ValidData = any>(
  // eslint-disable-next-line unused-imports/no-unused-vars
  fetcher: Input<TData | undefined>[0],
): Output<TData | undefined>;

export default function useServerState<TData extends ValidData = any>(
  // eslint-disable-next-line unused-imports/no-unused-vars
  fetcher: Input<TData>[0],
  // eslint-disable-next-line unused-imports/no-unused-vars
  initialData: Input<TData>[1],
): Output<TData>;

export default function useServerState<TData extends ValidData = any>(
  fetcher: Input<TData | undefined>[0],
  initialData?: Input<TData | undefined>[1],
): Output<TData | undefined> {
  const controllerRef = useRef<AbortController>();

  const initialState = useMemo<State<TData | undefined>>(
    () => ({ data: initialData, error: undefined, loading: false }),
    [initialData],
  );

  const [state, setState] = useState(initialState);
  const [reloadTrigger, setReloadTrigger] = useState(false);

  const reload = useCallback<Output<TData | undefined>["reload"]>(
    () => setReloadTrigger((prev) => !prev),
    [],
  );

  useEffect(() => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    const controller = controllerRef.current;

    setState((prevState) => ({ ...prevState, loading: true }));
    makeAsync(fetcher(controller.signal))
      .then((data) => {
        if (controller.signal.aborted) return;
        setState({ data, error: undefined, loading: false });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState((prevState) => ({ ...prevState, error, loading: false }));
      });

    return () => controller.abort();
  }, [fetcher, reloadTrigger]);

  return { ...state, reload };
}

async function makeAsync<TResult>(
  result: TResult | Promise<TResult>,
): Promise<TResult> {
  return result;
}
