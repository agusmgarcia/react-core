import {
  type Func,
  type OmitFuncs,
  type OmitProperty,
  type TupleToUnion,
  type UnionToIntersection,
} from "#src/utils";

import { type CreateGlobalSliceTypes } from "../createGlobalSlice";

/**
 * Defines a middleware type for the global store, parameterized by an array of slice factory outputs.
 *
 * @template TSliceFactories - An array of slice factory outputs, each conforming to the `CreateGlobalSliceTypes.Output` type.
 *
 * @remarks
 * This type is used to specify middleware functions that operate on the global store state,
 * where the state shape is determined by the intersection of all slices produced by the provided factories.
 */
export type Middleware<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
> = CreateGlobalSliceTypes.Middleware<
  CreateGlobalSliceTypes.SliceOf<string, {}>,
  SlicesOf<TSliceFactories>
>;

/**
 * Represents the input type for the `createStore` function.
 *
 * @template TSliceFactories - An array of slice factory outputs, each conforming to the `CreateGlobalSliceTypes.Output` type.
 */
export type Input<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
> = TSliceFactories;

/**
 * Extracts the slice type from a given slice factory type.
 *
 * This utility type takes a type parameter `TSliceFactory` that extends
 * `CreateGlobalSliceTypes.Output` and infers the first generic argument
 * (`TSlice`) from it. If `TSliceFactory` matches the expected structure,
 * it returns the inferred slice type; otherwise, it returns `never`.
 *
 * @typeParam TSliceFactory - A type extending `CreateGlobalSliceTypes.Output`
 *                            from which to extract the slice type.
 * @returns The extracted slice type or `never` if the type does not match.
 */
type ExtractSlice<
  TSliceFactory extends CreateGlobalSliceTypes.Output<any, any, any>,
> =
  TSliceFactory extends CreateGlobalSliceTypes.Output<infer TSlice, any, any>
    ? TSlice
    : never;

/**
 * Given an array of slice factory types, computes the intersection of all extracted slice types.
 *
 * @template TSliceFactories - An array of types extending `CreateGlobalSliceTypes.Output`.
 * @returns The intersection type of all slices produced by the provided factories.
 *
 * @remarks
 * This utility type is useful for combining multiple slice types into a single state shape,
 * typically in the context of a global store or state management system.
 */
export type SlicesOf<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
> = UnionToIntersection<ExtractSlice<TupleToUnion<TSliceFactories>>>;

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
        initialState?: Partial<OmitFuncs<SlicesOf<TSliceFactories>, "shallow">>;
      },
    ]
  >;
  useSelector: <TSelectedData>(
    selector: Func<
      TSelectedData,
      [
        state: OmitProperty<
          SlicesOf<TSliceFactories>,
          "__internal__",
          "shallow"
        >,
      ]
    >,
  ) => TSelectedData;
};
