import { type Func, type OmitFuncs } from "#src/utils";

import createGlobalSlice, {
  type CreateGlobalSliceTypes,
} from "../createGlobalSlice";
import {
  type ExtractDataOf,
  type ExtractNameOf,
  type ExtractSelectedOf,
  type Input,
  type Output,
  type SliceOf,
} from "./createServerSlice.types";

export default function createServerSlice<
  TSlice extends SliceOf<any, any, any>,
  TOtherSlices = {},
>(...input: Input<TSlice, TOtherSlices>): Output<TSlice, TOtherSlices> {
  return (initialData) => {
    const name = input[0];
    const fetcher = input[1];
    const selector = input[2];

    async function reloadHelper(
      args: Partial<ExtractSelectedOf<TSlice>> | undefined,
      context: CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
      mergeData: Func<
        ExtractDataOf<TSlice>,
        [newData: ExtractDataOf<TSlice>, prevData: ExtractDataOf<TSlice>]
      >,
    ): Promise<void> {
      context.set((prevState) => ({ ...prevState, loading: true }));

      try {
        const selected = !!selector
          ? selector(context.get() as OmitFuncs<TOtherSlices>)
          : ({} as ExtractSelectedOf<TSlice>);

        const data = await fetcher({ ...selected, ...args }, context.signal);

        if (context.signal.aborted) return;
        context.set((prevState) => ({
          ...prevState,
          data: mergeData(data, prevState.data),
          error: undefined,
          loading: false,
        }));
      } catch (error) {
        if (context.signal.aborted) return;
        context.set((prevState) => ({ ...prevState, error, loading: false }));
      }
    }

    async function loadMore(
      args: Partial<ExtractSelectedOf<TSlice>> | undefined,
      context: CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
    ): Promise<void> {
      return reloadHelper(args, context, (newData, prevData) =>
        Array.isArray(prevData) && Array.isArray(newData)
          ? [...prevData, ...newData]
          : newData,
      );
    }

    async function reload(
      args: Partial<ExtractSelectedOf<TSlice>> | undefined,
      context: CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
    ): Promise<void> {
      return reloadHelper(args, context, (newData) => newData);
    }

    const result = createGlobalSlice<TSlice, TOtherSlices>(
      name,
      (subscribe) => {
        subscribe((_, ctx) => reload(undefined, ctx), selector);

        return {
          data: undefined,
          error: undefined,
          loading: true,
          loadMore,
          reload,
        } as CreateGlobalSliceTypes.WithContext<TSlice, TOtherSlices>;
      },
    );

    return result({
      [name]: {
        data: initialData?.[name],
        error: undefined,
        loading: true,
      },
    } as Record<
      ExtractNameOf<TSlice>,
      OmitFuncs<CreateGlobalSliceTypes.ExtractStateOf<TSlice>>
    >);
  };
}
