/**
 * Throws an error and terminates the execution of the current function.
 *
 * @param error - The error object to be thrown.
 * @throws The provided error object.
 * @returns This function never returns as it always throws an error.
 */
export default function throwError(error: Error): never;

/**
 * Throws an error with the provided message and options.
 *
 * @param message - The error message to be thrown.
 * @param options - Optional error options.
 * @throws An Error object with the provided message and options.
 * @returns This function never returns as it always throws an error.
 */
export default function throwError(
  message: string,
  options?: ErrorOptions,
): never;

export default function throwError(
  errorOrMessage: Error | string,
  options?: ErrorOptions,
): never {
  if (typeof errorOrMessage === "string")
    throw new Error(errorOrMessage, options);

  throw errorOrMessage;
}
