import { type CreateSliceTypes } from "../createSlice";

export type HooksOf<
  TCreateSliceOutputs extends Record<string, CreateSliceTypes.Output<any, any>>,
> = {
  [TSliceName in keyof TCreateSliceOutputs]: TCreateSliceOutputs[TSliceName] extends CreateSliceTypes.Output<
    any,
    StateOf<TCreateSliceOutputs>
  >
    ? TCreateSliceOutputs[TSliceName]
    : never;
};

export type StateOf<
  TCreateSliceOutputs extends Record<string, CreateSliceTypes.Output<any, any>>,
> = {
  [TSliceName in keyof TCreateSliceOutputs]: CreateSliceTypes.ValueOf<
    TCreateSliceOutputs[TSliceName]
  >;
};

export type InitialsOf<
  TCreateSliceOutputs extends Record<string, CreateSliceTypes.Output<any, any>>,
> = {
  [TSliceName in keyof TCreateSliceOutputs]: any | undefined;
};

export type Input<
  TCreateSliceOutputs extends Record<string, CreateSliceTypes.Output<any, any>>,
> = [hooks: HooksOf<TCreateSliceOutputs>, options?: { devtools?: boolean }];

export type Output<
  TCreateSliceOutputs extends Record<string, CreateSliceTypes.Output<any, any>>,
> = {
  StoreProvider: (props: {
    children?: React.ReactNode;
    initials?: InitialsOf<TCreateSliceOutputs>;
  }) => JSX.Element;
  useSelector: <TSelectedData>(
    selector: (state: StateOf<TCreateSliceOutputs>) => TSelectedData,
  ) => TSelectedData;
};

declare global {
  var __AGUSMGARCIA_REACT_CORE_DEVTOOLS_EXTENSION__:
    | ReturnType<
        NonNullable<typeof window.__REDUX_DEVTOOLS_EXTENSION__>["connect"]
      >
    | undefined;
  var __AGUSMGARCIA_REACT_CORE_DEVTOOLS_STATE__: StateOf<Record<string, any>>;
}
