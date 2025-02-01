type OmitFuncs<TData> = TData extends object
  ? {
      [TProperty in keyof TData as TData[TProperty] extends Function
        ? never
        : TProperty]: OmitFuncs<TData[TProperty]>;
    }
  : TData;

export default OmitFuncs;
