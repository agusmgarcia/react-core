import { useEffect, useState } from "react";

/**
 * A custom React hook that provides the current device pixel ratio (DPR).
 * It listens for changes in the device's pixel ratio and updates the value accordingly.
 *
 * @returns {number} The current device pixel ratio.
 *
 * @example
 * ```tsx
 * const devicePixelRatio = useDevicePixelRatio();
 * console.log(devicePixelRatio); // Logs the current DPR, e.g., 2 for Retina displays.
 * ```
 *
 * @remarks
 * This hook uses the `window.devicePixelRatio` property and a `matchMedia` listener
 * to detect changes in the device's pixel ratio. It ensures the value is updated
 * dynamically when the resolution changes.
 */
export default function useDevicePixelRatio(): number {
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);

  useEffect(() => {
    const handler = () => setDevicePixelRatio(window.devicePixelRatio);
    handler();

    const list = window.matchMedia(`(resolution: ${devicePixelRatio}dppx)`);

    list.addEventListener("change", handler);
    return () => list.removeEventListener("change", handler);
  }, [devicePixelRatio]);

  return devicePixelRatio;
}
