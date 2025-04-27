/**
 * Creates a promise that resolves after a specified delay in milliseconds.
 * If an `AbortSignal` is provided and aborted, the promise will reject with the abort reason.
 *
 * @param ms - The number of milliseconds to delay before resolving the promise.
 * @param signal - An optional `AbortSignal` that can be used to cancel the delay.
 *
 * @returns A promise that resolves after the specified delay, or rejects if the signal is aborted.
 *
 * @throws If the `AbortSignal` is already aborted when the function is called, the promise will immediately reject.
 *
 * @example
 * ```typescript
 * const controller = new AbortController();
 * const signal = controller.signal;
 *
 * delay(1000, signal).then(() => {
 *   console.log('Resolved after 1 second');
 * }).catch((error) => {
 *   console.error('Promise rejected:', error);
 * });
 *
 * // Abort the delay
 * controller.abort();
 * ```
 */
export default function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    let timeoutHandler: NodeJS.Timeout;

    function signalHandler() {
      clearTimeout(timeoutHandler);
      if (!signal) return;

      signal.removeEventListener("abort", signalHandler);
      try {
        signal.throwIfAborted();
      } catch (error) {
        reject(error);
      }
    }

    if (!!signal) {
      try {
        signal.throwIfAborted();
      } catch (error) {
        reject(error);
      }

      signal.addEventListener("abort", signalHandler);
    }

    timeoutHandler = setTimeout(() => {
      if (!!signal) signal.removeEventListener("abort", signalHandler);
      resolve();
    }, ms);
  });
}
