/**
 * Compares two numbers and returns a value indicating their relative order.
 * This function sorts numbers in ascending order.
 *
 * @param value1 - The first number to compare.
 * @param value2 - The second number to compare.
 * @returns A negative number if `value1` is less than `value2`,
 *          zero if they are equal, or a positive number if `value1` is greater than `value2`.
 */
export function byNumberAsc(value1: number, value2: number): number {
  return value1 - value2;
}

/**
 * Compares two numbers and returns a value indicating their relative order.
 * This function sorts numbers in descending order.
 *
 * @param value1 - The first number to compare.
 * @param value2 - The second number to compare.
 * @returns A negative number if `value1` is greater than `value2`,
 *          zero if they are equal, or a positive number if `value1` is less than `value2`.
 */
export function byNumberDesc(value1: number, value2: number): number {
  return byNumberAsc(value2, value1);
}

/**
 * Compares two strings and returns a value indicating their relative order.
 * This function sorts strings in ascending order.
 *
 * @param value1 - The first string to compare.
 * @param value2 - The second string to compare.
 * @returns A negative number if `value1` is less than `value2`,
 *          zero if they are equal, or a positive number if `value1` is greater than `value2`.
 */
export function byStringAsc(value1: string, value2: string): number {
  return +(value1 > value2) || -(value2 > value1);
}

/**
 * Compares two strings and returns a value indicating their relative order.
 * This function sorts strings in descending order.
 *
 * @param value1 - The first string to compare.
 * @param value2 - The second string to compare.
 * @returns A negative number if `value1` is greater than `value2`,
 *          zero if they are equal, or a positive number if `value1` is less than `value2`.
 */
export function byStringDesc(value1: string, value2: string): number {
  return byStringAsc(value2, value1);
}

/**
 * Compares two boolean values and returns a value indicating their relative order.
 * This function sorts booleans in ascending order, where `false` is considered less than `true`.
 *
 * @param value1 - The first boolean to compare.
 * @param value2 - The second boolean to compare.
 * @returns A negative number if `value1` is `false` and `value2` is `true`,
 *          zero if they are equal, or a positive number if `value1` is `true` and `value2` is `false`.
 */
export function byBooleanAsc(value1: boolean, value2: boolean): number {
  if (value1 && !value2) return -1;
  if (!value1 && value2) return 1;
  return 0;
}

/**
 * Compares two boolean values and returns a value indicating their relative order.
 * This function sorts booleans in descending order, where `true` is considered less than `false`.
 *
 * @param value1 - The first boolean to compare.
 * @param value2 - The second boolean to compare.
 * @returns A negative number if `value1` is `true` and `value2` is `false`,
 *          zero if they are equal, or a positive number if `value1` is `false` and `value2` is `true`.
 */
export function byBooleanDesc(value1: boolean, value2: boolean): number {
  return byBooleanAsc(value2, value1);
}
