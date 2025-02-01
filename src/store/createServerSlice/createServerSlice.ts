import { type OmitFuncs } from "#src/utilities";

import createGlobalSlice, {
  type CreateGlobalSliceTypes,
} from "../createGlobalSlice";
import {
  type Input,
  type Output,
  type SliceOf,
} from "./createServerSlice.types";

export default function createServerSlice<
  TSlice extends SliceOf<any, any>,
  TOtherSlices = {},
  TSelected = {},
>(
  ...input: Input<TSlice, TOtherSlices, TSelected>
): Output<TSlice, TOtherSlices> {
  return () => {
    const name = input[0];
    const fetcher = input[1];
    const selector = input[2];

    async function reload(
      context: CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
    ): Promise<void> {
      context.set((prevState) => ({ ...prevState, loading: true }));

      try {
        const data = await fetcher(
          selector !== undefined
            ? selector(context.get() as OmitFuncs<TOtherSlices>)
            : (context.get() as TSelected),
          context.signal,
        );

        if (context.signal.aborted) return;
        context.set((prevState) => ({
          ...prevState,
          data,
          error: undefined,
          loading: false,
        }));
      } catch (error) {
        if (context.signal.aborted) return;
        context.set((prevState) => ({ ...prevState, error, loading: false }));
      }
    }

    const result = createGlobalSlice<TSlice, TOtherSlices>(
      name,
      (subscribe) => {
        subscribe((_, ctx) => reload(ctx), selector);

        return {
          data: undefined,
          error: undefined,
          loading: true,
          reload,
        } as any;
      },
    );

    return result();
  };
}
