import { type Func, type OmitFuncs } from "#src/utilities";

import { type CreateGlobalSliceTypes } from "../createGlobalSlice";

export type Input<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
> = TSliceFactories;

type TupleToUnion<TArray> = TArray extends unknown[] ? TArray[number] : never;

type ExtractState<
  TSliceFactory extends CreateGlobalSliceTypes.Output<any, any, any>,
> =
  TSliceFactory extends CreateGlobalSliceTypes.Output<infer TSlice, any, any>
    ? TSlice
    : never;

type UnionToIntersection<Union> = (
  Union extends unknown ? (distributedUnion: Union) => void : never
) extends (mergedIntersection: infer Intersection) => void
  ? Intersection & Union
  : never;

export type StateOf<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
> = UnionToIntersection<ExtractState<TupleToUnion<TSliceFactories>>>;

export type Output<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
> = {
  StoreProvider: Func<
    JSX.Element,
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
