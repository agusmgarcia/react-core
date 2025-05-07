import { loadEnvConfig } from "@next/env";

export default function getEnvFiles(
  environment: "development" | "production" | "test",
): string[] {
  return loadEnvConfig(
    process.cwd(),
    environment === "development"
      ? true
      : environment === "test"
        ? undefined
        : false,
  ).loadedEnvFiles.map((file) => file.path);
}
