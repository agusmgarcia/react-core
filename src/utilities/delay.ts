export default function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    let timeoutHandler: NodeJS.Timeout;

    function signalHandler() {
      clearTimeout(timeoutHandler);
      if (signal === undefined) return;

      signal.removeEventListener("abort", signalHandler);
      try {
        signal.throwIfAborted();
      } catch (error) {
        reject(error);
      }
    }

    if (signal !== undefined) {
      try {
        signal.throwIfAborted();
      } catch (error) {
        reject(error);
      }

      signal.addEventListener("abort", signalHandler);
    }

    timeoutHandler = setTimeout(() => {
      if (signal !== undefined)
        signal.removeEventListener("abort", signalHandler);
      resolve();
    }, ms);
  });
}
