import { type Input, type Output } from "./createSlice.types";

export default function createSlice<
  TValue extends Record<string, any> = {},
  TState extends Record<string, Record<string, any>> = {},
>(hook: Input<TValue, TState>): Output<TValue, TState> {
  return hook;
}
