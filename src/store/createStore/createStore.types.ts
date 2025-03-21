import {
  type Func,
  type OmitFuncs,
  type TupleToUnion,
  type UnionToIntersection,
} from "#src/utils";

import { type CreateGlobalSliceTypes } from "../createGlobalSlice";

export type Input<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
> = TSliceFactories;

type ExtractState<
  TSliceFactory extends CreateGlobalSliceTypes.Output<any, any, any>,
> =
  TSliceFactory extends CreateGlobalSliceTypes.Output<infer TSlice, any, any>
    ? TSlice
    : never;

export type StateOf<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
> = UnionToIntersection<ExtractState<TupleToUnion<TSliceFactories>>>;

export type Output<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
> = {
  StoreProvider: Func<
    React.ReactElement,
    [
      props: {
        children?: React.ReactNode;
        initialState?: Partial<OmitFuncs<StateOf<TSliceFactories>>>;
      },
    ]
  >;
  useSelector: <TSelectedData>(
    selector: Func<TSelectedData, [state: StateOf<TSliceFactories>]>,
  ) => TSelectedData;
};
