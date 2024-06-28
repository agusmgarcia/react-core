import delay from "./delay";

export default async function blockUntil(signal: AbortSignal): Promise<void> {
  try {
    while (true) await delay(86_400_00, signal);
  } catch (error) {
    if (signal.aborted) return;
    throw error;
  }
}
