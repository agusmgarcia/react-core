import { create } from "zustand";
import { devtools } from "zustand/middleware";

import {
  type Context,
  type Input,
  type Output,
} from "./createGlobalState.types";

export default function createGlobalState<TState extends object>(
  ...input: Input<TState>
): Output<TState> {
  return create<TState>()(
    devtools(
      (set, get) => {
        let controller = new AbortController();

        const stateWithFunctionsWithContext = input[0]();

        return Object.keys(stateWithFunctionsWithContext).reduce(
          (result, key) => {
            const element = stateWithFunctionsWithContext[key as keyof TState];
            result[key as keyof TState] = element as any;

            if (element instanceof Function) {
              result[key as keyof TState] = ((...args: any[]) => {
                controller.abort();
                controller = new AbortController();
                const signal = controller.signal;

                return element(...args, {
                  get,
                  set,
                  signal,
                } as unknown as Context<TState>);
              }) as any;
            }

            return result;
          },
          {} as TState,
        );
      },
      {
        name: input[1],
      },
    ),
  );
}
