type Merge<TObjectA, TObjectB> = {
  [K in keyof TObjectA | keyof TObjectB]: K extends keyof TObjectA &
    keyof TObjectB
    ? TObjectA[K] | TObjectB[K]
    : K extends keyof TObjectB
      ? TObjectB[K]
      : K extends keyof TObjectA
        ? TObjectA[K]
        : never;
};

export default Merge;
