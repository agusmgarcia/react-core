type OmitFuncs<TData> = TData extends object
  ? TData extends Array<any>
    ? TData
    : TData extends Function
      ? TData
      : {
          [TProperty in keyof TData as TData[TProperty] extends Function
            ? never
            : TProperty]: OmitFuncs<TData[TProperty]>;
        }
  : TData;

export default OmitFuncs;
