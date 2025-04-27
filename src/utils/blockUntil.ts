import delay from "./delay";

/**
 * Blocks the execution until the provided signal is aborted.
 * @param signal - The AbortSignal to block until aborted.
 * @returns A promise that resolves when the signal is aborted.
 */
export default async function blockUntil(signal: AbortSignal): Promise<void> {
  try {
    while (true) await delay(86_400_00, signal);
  } catch (error) {
    if (signal.aborted) return;
    throw error;
  }
}
