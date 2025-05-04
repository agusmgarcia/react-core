import {
  type Func,
  type OmitFuncs,
  type TupleToUnion,
  type UnionToIntersection,
} from "#src/utils";

import { type CreateGlobalSliceTypes } from "../createGlobalSlice";

/**
 * Represents the input type for the `createStore` function.
 *
 * @template TSliceFactories - An array of slice factory outputs, each conforming to the `CreateGlobalSliceTypes.Output` type.
 */
export type Input<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
> = TSliceFactories;

/**
 * Extracts the state type from a given slice factory.
 *
 * @template TSliceFactory - A single slice factory output conforming to the `CreateGlobalSliceTypes.Output` type.
 *
 * @remarks
 * If the provided slice factory matches the `CreateGlobalSliceTypes.Output` type,
 * the state type (`TSlice`) is extracted. Otherwise, it resolves to `never`.
 */
type ExtractState<
  TSliceFactory extends CreateGlobalSliceTypes.Output<any, any, any>,
> =
  TSliceFactory extends CreateGlobalSliceTypes.Output<infer TSlice, any, any>
    ? TSlice
    : never;

/**
 * Computes the combined state type from an array of slice factories.
 *
 * @template TSliceFactories - An array of slice factory outputs, each conforming to the `CreateGlobalSliceTypes.Output` type.
 *
 * @remarks
 * This type uses utility types to transform the array of slice factories into a union of their state types,
 * and then into an intersection of those state types.
 */
export type StateOf<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
> = UnionToIntersection<ExtractState<TupleToUnion<TSliceFactories>>>;

/**
 * Represents the output type of the `createStore` function.
 *
 * @template TSliceFactories - An array of slice factory outputs, each conforming to the `CreateGlobalSliceTypes.Output` type.
 *
 * @property StoreProvider - A React functional component that provides the store context.
 *   - `props.children` (optional): The child components to render within the provider.
 *   - `props.initialState` (optional): An object representing the initial state,
 *     which can partially override the default state. Functions are omitted from the state type.
 *
 * @property useSelector - A hook for selecting data from the store state.
 *   - `selector`: A function that receives the store state and returns the selected data.
 *   - Returns the selected data of type `TSelectedData`.
 */
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
