export type ValueOf<TOutput extends Output<any, any>> =
  TOutput extends Output<infer TValue, any> ? TValue : never;

export type UseSelector<TState extends Record<string, Record<string, any>>> = <
  TSelectedValue,
>(
  selector: (state: Partial<TState>) => TSelectedValue,
) => TSelectedValue;

export type Input<
  TValue extends Record<string, any>,
  TState extends Record<string, Record<string, any>>,
> = (initial: any, useSelector: UseSelector<TState>) => TValue;

export type Output<
  TValue extends Record<string, any>,
  TState extends Record<string, Record<string, any>>,
> = (initial: any, useSelector: UseSelector<TState>) => TValue;
