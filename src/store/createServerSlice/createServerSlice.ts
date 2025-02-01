import { equals, type Func, type OmitFuncs } from "#src/utilities";

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
  TSelected extends object = {},
>(
  ...input: Input<TSlice, TOtherSlices, TSelected>
): Output<TSlice, TOtherSlices> {
  return () => {
    const name = input[0];
    const fetcher = input[1];
    const selector = input[2];

    async function loadMore(
      args: { limit: number | undefined } | undefined,
      context: CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
    ): Promise<void> {
      const selected =
        selector !== undefined
          ? selector(context.get() as OmitFuncs<TOtherSlices>)
          : {};

      await reloadHelper(
        (prevState) => ({
          limit:
            args?.limit !== undefined
              ? args.limit
              : prevState._pagination.limit,
          page: equals.shallow(prevState._selected, selected)
            ? prevState._pagination.page + 1
            : 1,
        }),
        (data, prevState) =>
          prevState._pagination.page === 1
            ? Array.isArray(prevState.data) && Array.isArray(data)
              ? ([...prevState.data, ...data] as typeof data)
              : data
            : data,
        context,
      );
    }

    async function reload(
      context: CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
    ): Promise<void> {
      await reloadHelper(
        () => ({ limit: 100, page: 1 }),
        (data) => data,
        context,
      );
    }

    async function reloadHelper(
      paginationFactory: Func<
        TSlice[keyof TSlice]["_pagination"],
        [prevState: OmitFuncs<TSlice[keyof TSlice]>]
      >,
      dataFactory: Func<
        Awaited<TSlice[keyof TSlice]["data"]>,
        [
          data: Awaited<TSlice[keyof TSlice]["data"]>,
          prevState: OmitFuncs<TSlice[keyof TSlice]>,
        ]
      >,
      context: CreateGlobalSliceTypes.Context<TSlice, TOtherSlices>,
    ): Promise<void> {
      context.set((prevState) => ({
        ...prevState,
        _pagination: paginationFactory(prevState),
        loading: true,
      }));

      try {
        const selected =
          selector !== undefined
            ? selector(context.get() as OmitFuncs<TOtherSlices>)
            : {};

        const data = await fetcher(
          {
            ...selected,
            limit: context.get()[name as string]._pagination.limit,
            page: context.get()[name as string]._pagination.page,
          } as TSelected & { limit: number; page: number },
          context.signal,
        );

        if (context.signal.aborted) return;
        context.set((prevState) => ({
          ...prevState,
          _selected: selected,
          data: dataFactory(data, prevState),
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
          _pagination: { limit: 100, page: 1 },
          _selected: undefined,
          data: undefined,
          error: undefined,
          loading: true,
          loadMore,
          reload,
        } as any;
      },
    );

    return result();
  };
}
