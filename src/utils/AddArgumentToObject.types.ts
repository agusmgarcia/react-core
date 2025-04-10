import type Func from "./Func.types";

type AddArgumentToObject<TObject, TParameter> = TObject extends object
  ? {
      [TProperty in keyof TObject]: TObject[TProperty] extends Func<
        infer TResult,
        infer TArgs
      >
        ? Func<TResult, [...args: TArgs, parameter: TParameter]>
        : AddArgumentToObject<TObject[TProperty], TParameter>;
    }
  : TObject;

export default AddArgumentToObject;
