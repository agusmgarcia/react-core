import { type Func } from "#src/utilities";

export type ValueOf<TOutput extends Output<any, any>> =
  TOutput extends Output<infer TValue, any> ? TValue : never;

export type UseSelector<TState extends Record<string, Record<string, any>>> = <
  TSelectedValue,
>(
  selector: Func<TSelectedValue, [state: Partial<TState>]>,
) => TSelectedValue;

export type Input<
  TValue extends Record<string, any>,
  TState extends Record<string, Record<string, any>>,
> = Func<TValue, [initial: any, useSelector: UseSelector<TState>]>;

export type Output<
  TValue extends Record<string, any>,
  TState extends Record<string, Record<string, any>>,
> = Func<TValue, [initial: any, useSelector: UseSelector<TState>]>;
