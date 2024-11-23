type OmitFuncs<TModel extends object> = {
  [TProperty in keyof TModel as TModel[TProperty] extends (
    ...args: any[]
  ) => any
    ? never
    : TProperty]: TModel[TProperty];
};

export default OmitFuncs;
