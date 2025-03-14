import { useEffect, useState } from "react";

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
